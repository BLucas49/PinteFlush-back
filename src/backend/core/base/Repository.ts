import { Pool, QueryResult, QueryResultRow } from "pg";

export abstract class ARepository {
  protected readonly pool: Pool;
  protected abstract readonly tableName: string;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  protected async query<R extends QueryResultRow>(
    sql: string,
    params: unknown[] = [],
  ): Promise<QueryResult<R>> {
    try {
      // pool.query gère lui-même l'acquisition et la libération du client
      return await this.pool.query<R>(sql, params);
    } catch (error) {
      console.error(`Database query error: ${sql}`, error);
      throw error;
    }
  }
}
