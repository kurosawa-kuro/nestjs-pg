import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool,
  ) {}

  async createUser(name: string): Promise<void> {
    const query = 'INSERT INTO "user"(name) VALUES($1)';
    await this.pool.query(query, [name]);
  }

  async getUsers(): Promise<any[]> {
    const query = 'SELECT * FROM "user"';
    const result = await this.pool.query(query);
    return result.rows;
  }
}
