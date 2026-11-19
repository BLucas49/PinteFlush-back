import { ARepository } from "../../core/base/Repository.js";
import { NewUser, User } from "./Users.model.js";

export class UsersRepository extends ARepository {
  protected tableName: string = "users";

  public async findById(id: string): Promise<User | null> {
    const result = await this.query<User>(
      `SELECT * FROM users WHERE id = $1;`,
      [id],
    );

    return result.rows[0] ?? null;
  }

  public async findByMail(email: string): Promise<User | null> {
    const result = await this.query<User>(
      `SELECT * FROM users WHERE email = $1;`,
      [email],
    );

    return result.rows[0] ?? null;
  }

  /** Crée l'utilisateur et renvoie son id. */
  public async create(u: NewUser): Promise<string> {
    const result = await this.query<Pick<User, "id">>(
      `INSERT INTO users (email, first_name, last_name, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id;`,
      [u.email, u.first_name, u.last_name, u.password],
    );
    return result.rows[0].id;
  }
}
