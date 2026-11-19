import { ARepository } from "../../core/base/Repository.js";
import { Game } from "./Games.model.js";

export class GamesRepository extends ARepository {
  protected tableName: string = "games";

  public async findById(id: string): Promise<Game | null> {
    const result = await this.query<Game>(
      `SELECT * FROM games WHERE id = $1;`,
      [id],
    );

    return result.rows[0] ?? null;
  }
}
