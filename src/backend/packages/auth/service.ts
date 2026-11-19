import { AService } from "../../core/base/Service.js";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../../core/types/errors.js";
import {
  fakePasswordCheck,
  hashPassword,
  verifyPassword,
} from "../../core/utils/pwd.js";
import {
  generateRefreshToken,
  hashToken,
  REFRESH_TOKEN_TTL_MS,
  signAccessToken,
} from "../../core/utils/tokens.js";
import { User } from "../../db/Users/Users.model.js";
import { LoginInput, PASSWORD_MAX_BYTES, RegisterInput } from "./dto.js";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const PG_UNIQUE_VIOLATION = "23505";

const isUniqueViolation = (err: unknown): boolean =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  err.code === PG_UNIQUE_VIOLATION;

export class AuthService extends AService {
  public login = async ({
    email,
    password,
  }: LoginInput): Promise<{ user: User; tokens: AuthTokens }> => {
    const user = await this.rManager.Users().findByMail(email);

    if (user === null) {
      await fakePasswordCheck(password);
      throw new UnauthorizedError("Informations de connexion incorrectes");
    }
    if (!(await verifyPassword(password, user.password))) {
      throw new UnauthorizedError("Informations de connexion incorrectes");
    }

    return { user, tokens: await this.openSession(user.id) };
  };

  public register = async (input: RegisterInput): Promise<string> => {
    if (Buffer.byteLength(input.password, "utf8") > PASSWORD_MAX_BYTES) {
      throw new BadRequestError(
        `Le mot de passe ne doit pas dépasser ${PASSWORD_MAX_BYTES} octets`,
      );
    }

    const existing = await this.rManager.Users().findByMail(input.email);
    if (existing !== null) throw new ConflictError("Email déjà utilisé");

    try {
      return await this.rManager.Users().create({
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        password: await hashPassword(input.password),
      });
    } catch (err) {
      // Inscription concurrente avec le même email
      if (isUniqueViolation(err)) throw new ConflictError("Email déjà utilisé");
      throw err;
    }
  };

  /**
   * Rotation du refresh token : l'ancien est consommé (supprimé) et une
   * nouvelle session est ouverte. Un token déjà utilisé ou expiré est refusé.
   */
  public renew = async (refreshToken: string): Promise<AuthTokens> => {
    const session = await this.rManager
      .Sessions()
      .consumeByTokenHash(hashToken(refreshToken));

    if (session === null || session.expires_at.getTime() <= Date.now()) {
      throw new UnauthorizedError("Session expirée, reconnectez-vous");
    }

    return this.openSession(session.user_id);
  };

  /** Déconnexion de tous les appareils de l'utilisateur. */
  public logout = async (userId: string): Promise<void> => {
    await this.rManager.Sessions().deleteAllForUser(userId);
  };

  private readonly openSession = async (
    userId: string,
  ): Promise<AuthTokens> => {
    const refreshToken = generateRefreshToken();
    const sessions = this.rManager.Sessions();

    await sessions.deleteExpiredForUser(userId);
    await sessions.create(
      userId,
      hashToken(refreshToken),
      new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    );

    return { accessToken: signAccessToken(userId), refreshToken };
  };
}
