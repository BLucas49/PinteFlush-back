import { ARepository } from "../../core/base/Repository.js";
import { Session } from "./Sessions.model.js";

export class SessionsRepository extends ARepository {
  protected tableName: string = "sessions";

  public async create(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.query(
      `INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3);`,
      [userId, tokenHash, expiresAt],
    );
  }

  /**
   * Supprime la session correspondant au token et la renvoie (usage unique).
   * Atomique : deux requêtes concurrentes avec le même token ne peuvent pas
   * toutes les deux le consommer.
   */
  public async consumeByTokenHash(tokenHash: string): Promise<Session | null> {
    const result = await this.query<Session>(
      `DELETE FROM sessions WHERE token_hash = $1 RETURNING *;`,
      [tokenHash],
    );

    return result.rows[0] ?? null;
  }

  public async deleteAllForUser(userId: string): Promise<void> {
    await this.query(`DELETE FROM sessions WHERE user_id = $1;`, [userId]);
  }

  public async deleteExpiredForUser(userId: string): Promise<void> {
    await this.query(
      `DELETE FROM sessions WHERE user_id = $1 AND expires_at <= now();`,
      [userId],
    );
  }
}
