import { Pool } from "pg";
import { UsersRepository } from "./Users/Users.repository.js";
import { GamesRepository } from "./Games/Games.repository.js";
import { SessionsRepository } from "./Sessions/Sessions.repository.js";

export class RepositoryManager {
  private static instance: RepositoryManager;
  private readonly pool: Pool;
  private readonly usersRepository: UsersRepository;
  private readonly gamesRepository: GamesRepository;
  private readonly sessionsRepository: SessionsRepository;

  constructor(pool: Pool) {
    RepositoryManager.instance = this;
    this.pool = pool;
    this.usersRepository = new UsersRepository(pool);
    this.gamesRepository = new GamesRepository(pool);
    this.sessionsRepository = new SessionsRepository(pool);
  }

  public static getInstance(): RepositoryManager {
    if (!RepositoryManager.instance) {
      throw new Error("Repository non définis");
    }
    return RepositoryManager.instance;
  }

  async verifyConnection(): Promise<void> {
    try {
      // Attempt to acquire a client from the pool
      const client = await this.pool.connect();
      console.log("✅ Api connecté à la base de données");
      client.release();
    } catch (error) {
      console.error(
        "❌ Impossible de se connecter à la base de données :",
        error,
      );
    }
  }

  public Users(): UsersRepository {
    return this.usersRepository;
  }

  public Games(): GamesRepository {
    return this.gamesRepository;
  }
  public Sessions(): SessionsRepository {
    return this.sessionsRepository;
  }
}
