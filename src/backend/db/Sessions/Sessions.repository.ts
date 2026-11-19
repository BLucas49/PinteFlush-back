import { ARepository } from "../../core/base/Repository.js";
import { Session } from "./Sessions.model.js";

export class SessionsRepository extends ARepository {
  protected tableName: string = "sessions";

  public createSession = async (userId: string, token: string) => {
    await this.query(
      `INSERT INTO sessions (user_id, token_hash) VALUES ($1, $2)`,
      [userId, token],
    );
  };

  public revokeSession = async (userId: string) => {
    await this.query("DELETE FROM sessions WHERE user_id = $1;", [userId]);
  };

  public findByTokenHash = async (token: string) => {
    const result = await this.query<Session>(
      `SELECT * FROM sessions WHERE token_hash = $1;`,
      [token],
    );

    return result.rows[0] ?? null;
  };

  public findFirstSession = async (userId: string) => {
    const result = await this.query<Session>(
      `SELECT * FROM sessions WHERE user_id = $1;`,
      [userId],
    );

    return result.rows[0] ?? null;
  };
}
