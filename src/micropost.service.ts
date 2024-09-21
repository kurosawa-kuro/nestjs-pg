import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class MicroPostService {
  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool,
  ) {}

  async createMicroPost(userId: number, title: string): Promise<void> {
    const query = 'INSERT INTO micropost(user_id, title) VALUES($1, $2)';
    await this.pool.query(query, [userId, title]);
  }

  async getMicroPosts(): Promise<any[]> {
    const query = 'SELECT * FROM micropost';
    const result = await this.pool.query(query);
    return result.rows;
  }
}
