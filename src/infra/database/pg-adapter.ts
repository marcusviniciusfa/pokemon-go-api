import { Pool, PoolClient } from 'pg'
import { DatabaseConnection } from './database-connection'

export class PgAdapter implements DatabaseConnection {
  private readonly pool: Pool
  private client: PoolClient | null

  constructor() {
    this.pool = new Pool({
      user: process.env.DATABASE_USERNAME,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT),
      max: 20,
      idleTimeoutMillis: 1000,
    })
  }

  async query(statement: any): Promise<any> {
    if (!this.client) {
      this.client = await this.pool.connect()
    }
    const result = await this.client.query(statement)
    return result
  }

  async connect(): Promise<void> {
    this.client = await this.pool.connect()
  }

  async release(): Promise<void> {
    if (this.client) {
      this.client.release()
      this.client = null
    }
  }

  async close(): Promise<void> {
    this.pool.end()
  }
}
