import { Repository } from "typeorm";
import { BcryptUtils } from "../../utils/bcrypt.utils";
import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/User.entity";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { IAuthResponse, IRegisterPayload, ILoginPayload } from "./interfaces";
import { generateToken } from "../../utils/jwt.utils";

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
}
