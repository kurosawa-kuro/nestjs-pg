import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

export interface User {
  id: number;
  name: string;
}

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool,
  ) {}

  async createUser(name: string): Promise<User> {
    const query = 'INSERT INTO "user"(name) VALUES($1) RETURNING id, name';
    const result = await this.pool.query(query, [name]);
    return result.rows[0];
  }

  async getUsers(): Promise<User[]> {
    const query = 'SELECT * FROM "user"';
    const result = await this.pool.query(query);
    return result.rows;
  }
}