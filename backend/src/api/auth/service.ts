import { Repository } from "typeorm";
import { BcryptUtils } from "../../utils/bcrypt.utils";
import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/User.entity";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import {
  IAuthResponse,
  IRegisterPayload,
  ILoginPayload,
  IUpdateUserPayload,
  UserDTO,
} from "./interfaces";
import { generateToken, generateResetPasswordToken, verifyResetPasswordToken } from "../../utils/jwt.utils";
import { htmlWelcomeContent, htmlResetPasswordContent } from "./helpers";
import config from "../../config/enviroment.config";

export default class AuthService {
  private readonly userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async register(payload: IRegisterPayload): Promise<IAuthResponse> {
    const normalizedEmail = payload.email.toLowerCase().trim();

    const existingUser = await this.userRepo.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "El email ya está en uso");
    }

    const hashedPassword = await BcryptUtils.createHash(payload.password);

    const newUser = await this.userRepo.save({
      ...payload,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const { id, email, role } = newUser;

    const tokenPayload = { id, email, role };

    const token = generateToken(tokenPayload);

    return { token };
  }

  async login(payload: ILoginPayload): Promise<IAuthResponse> {
    const normalizedEmail = payload.email.toLowerCase().trim();

    const user = await this.userRepo.findOne({
      where: { email: normalizedEmail },
    });
    if (!user) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const isPasswordValid = await BcryptUtils.isValidPassword(
      user,
      payload.password
    );
    if (!isPasswordValid) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { token };
  }

  async sendWelcomeEmail(email: string) {
    console.log(email);
    const url = "https://api.brevo.com/v3/smtp/email";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": config.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Code", email: "nc.equipo21@gmail.com" },
        replyTo: { email: "nc.equipo21@gmail.com", name: "Equipo 21" },
        to: [{ email: email, name: "Nuevo Usuario" }],
        textContent:
          "Hola Terry Martel, ¡Te damos la bienvenida a Pyme! Tu registro se ha completado exitosamente. Ahora puedes acceder a todos nuestros servicios de préstamos para Pymes. Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por unirte a nuestra comunidad!",
        subject: "¡Bienvenido a Pyme - Tu registro se ha completado!",
        htmlContent: htmlWelcomeContent(),
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error(err));
  }

  async updateUser(
    userId: string,
    payload: IUpdateUserPayload
  ): Promise<UserDTO> {
    // Buscar el usuario
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: [
        "id",
        "email",
        "password",
        "firstName",
        "lastName",
        "phone",
        "role",
        "isEmailVerified",
        "profileImage",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Usuario no encontrado");
    }

    // Verificar que currentPassword sea requerido para cambios sensibles
    const isSensitiveChange = payload.email || payload.newPassword;

    if (isSensitiveChange && !payload.currentPassword) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "La contraseña actual es requerida para cambiar email o contraseña"
      );
    }

    // Verificar contraseña actual si se intenta cambiar email o contraseña
    if (isSensitiveChange) {
      const isPasswordValid = await BcryptUtils.isValidPassword(
        user,
        payload.currentPassword!
      );

      if (!isPasswordValid) {
        throw new HttpError(
          HttpStatus.UNAUTHORIZED,
          "La contraseña actual es incorrecta"
        );
      }
    }

    // Si se intenta cambiar el email, verificar que no esté en uso
    if (payload.email) {
      const normalizedEmail = payload.email.toLowerCase().trim();

      if (normalizedEmail !== user.email) {
        const existingUser = await this.userRepo.findOne({
          where: { email: normalizedEmail },
        });

        if (existingUser) {
          throw new HttpError(
            HttpStatus.BAD_REQUEST,
            "El email ya está en uso por otro usuario"
          );
        }

        user.email = normalizedEmail;
        user.isEmailVerified = false; // Resetear verificación de email
      }
    }

    // Actualizar contraseña si se proporciona
    if (payload.newPassword) {
      user.password = await BcryptUtils.createHash(payload.newPassword);
    }

    // Actualizar otros campos
    if (payload.firstName !== undefined) {
      user.firstName = payload.firstName;
    }

    if (payload.lastName !== undefined) {
      user.lastName = payload.lastName;
    }

    if (payload.phone !== undefined) {
      user.phone = payload.phone || undefined;
    }

    if (payload.profileImage !== undefined) {
      user.profileImage = payload.profileImage || undefined;
    }

    // Guardar cambios
    const updatedUser = await this.userRepo.save(user);

    // Retornar DTO sin password
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName || null,
      lastName: updatedUser.lastName || null,
      phone: updatedUser.phone || null,
      role: updatedUser.role,
      isEmailVerified: updatedUser.isEmailVerified,
      profileImage: updatedUser.profileImage || null,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.userRepo.findOne({
      where: { email: normalizedEmail },
      select: ["id", "email", "firstName"],
    });

    if (!user) {
      // Nota: Por seguridad, no se revela si el email existe o no
      return;
    }

    const resetToken = generateResetPasswordToken({
      userId: user.id,
      email: user.email,
    });

    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const userName = user.firstName || "Usuario";

    // Enviar email con Brevo
    const url = "https://api.brevo.com/v3/smtp/email";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": config.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Pyme", email: "nc.equipo21@gmail.com" },
        replyTo: { email: "nc.equipo21@gmail.com", name: "Equipo de Soporte" },
        to: [{ email: user.email, name: userName }],
        subject: "Restablece tu contraseña - Pyme",
        htmlContent: htmlResetPasswordContent(resetUrl, userName),
      }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        console.error("Error al enviar email de restablecimiento:", await response.text());
        // Opcional: lanzar error si es crítico, pero comúnmente se loguea y se responde OK por seguridad
      }
    } catch (err) {
      console.error("Excepción al enviar email de restablecimiento:", err);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let payload: { userId: string; email: string };
    try {
      payload = verifyResetPasswordToken(token);
    } catch (error) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Token inválido o expirado");
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.userId, email: payload.email },
      select: ["id", "password"],
    });

    if (!user) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Token inválido");
    }

    // Evitar reutilizar la misma contraseña (opcional, pero recomendado)
    const isSamePassword = await BcryptUtils.isValidPassword(user, newPassword);
    if (isSamePassword) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "La nueva contraseña debe ser diferente a la actual");
    }

    const hashedPassword = await BcryptUtils.createHash(newPassword);
    await this.userRepo.update(user.id, { password: hashedPassword });
  }
}
