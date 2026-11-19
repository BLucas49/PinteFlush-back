import { AService } from "../../core/base/Service.js";
import { BadRequestError, UnauthorizedError } from "../../core/types/errors.js";
import { hashPassword, verifyPassword } from "../../core/utils/pwd.js";
import { User } from "../../db/Users/Users.model.js";
import jwt from "jsonwebtoken";

export class AuthService extends AService {
  public checkCredentials = async (
    email: string,
    password: string,
  ): Promise<User> => {
    const user = await this.rManager.Users().findByMail(email);
    if (user === null || !(await verifyPassword(password, user.password))) {
      throw new UnauthorizedError("information de connexion incorrrectes");
    }
    return user;
  };

  public createRefresh = async (userId: string): Promise<string> => {
    const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
      expiresIn: "24Weeks",
    });
    await this.rManager.Sessions().createSession(userId, token);
    return token;
  };

  public isValidUser = async (
    password: string,
    email: string,
  ): Promise<void> => {
    if (password.length < 20) throw new BadRequestError();
    const user = await this.rManager.Users().findByMail(email);
    if (user !== null) throw new UnauthorizedError();
  };

  public createUser = async (
    password: string,
    email: string,
    first_name: string,
    last_name: string,
  ) => {
    const hashedPassword = await hashPassword(password);
    const user = <User>{
      email,
      first_name,
      last_name,
      password: hashedPassword,
    };
    await this.rManager.Users().create(user);
  };

  public revokeSession = async (id: string) => {
    await this.rManager.Sessions().revokeSession(id);
  };
}
