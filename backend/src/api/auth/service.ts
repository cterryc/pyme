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
    
    const existingUser = await this.userRepo.findOne({ where: { email: payload.email } });
    if (existingUser) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Email already in use");
    }


    const hashedPassword = await BcryptUtils.createHash(payload.password);

    const newUser = this.userRepo.create({
      email: payload.email,
      password: hashedPassword,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
    });

    const savedUser = await this.userRepo.save(newUser);

    const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            lastName: newUser.lastName,
            firstName: newUser.firstName,
            role: newUser.role,
        });

    return { token };
  }

}