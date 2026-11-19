import { Pool, QueryResult, QueryResultRow } from "pg";

export abstract class ARepository {
  protected readonly pool: Pool;
  protected abstract readonly tableName: string;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  protected async query<R extends QueryResultRow>(
    sql: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any[],
  ): Promise<QueryResult<R>> {
    const connection = await this.pool.connect();
    try {
      return await connection.query<R>(sql, params);
    } catch (error) {
      console.error(`Database query error: ${sql}`, error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
