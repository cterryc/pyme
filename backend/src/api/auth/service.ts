import { Repository } from "typeorm";
import { BcryptUtils } from "../../utils/bcrypt.utils";
import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/User.entity";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { IAuthResponse, IRegisterPayload } from "./interfaces";
import { generateToken } from "../../utils/jwt.utils";

export default class AuthService {
  private readonly userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async register(payload: IRegisterPayload): Promise<IAuthResponse> {
    const existingUser = await this.userRepo.findOne({
      where: { email: payload.email },
    });
    if (existingUser) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Email already in use");
    }

    const hashedPassword = await BcryptUtils.createHash(payload.password);

    const newUser = await this.userRepo.save({
      ...payload,
      password: hashedPassword,
    });

    const { id, email, role } = newUser;

    const tokenPayload = { id, email, role };

    const token = generateToken(tokenPayload);

    return { token };
  }
}
