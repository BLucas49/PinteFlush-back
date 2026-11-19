import { ARepository } from "../../core/base/Repository.js";
import { User } from "./Users.model.js";

export class UsersRepository extends ARepository {
  protected tableName: string = "users";

  public async findById(id: string): Promise<User> {
    const result = await this.query<User>(
      `SELECT * FROM users WHERE id = $1;`,
      [id],
    );

    return result.rows[0] ?? null;
  }

  public async findByMail(email: string): Promise<User> {
    const result = await this.query<User>(
      `SELECT * FROM users WHERE email = $1;`,
      [email],
    );

    return result.rows[0] ?? null;
  }

  public async create(u: User): Promise<void> {
    await this.query(
      `INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)`,
      [u.email, u.first_name, u.last_name, u.password],
    );
  }
}
