import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { UserService } from './user.service';
import { MicroPostService } from './micropost.service';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';

// テスト環境かどうか判定し、適切な.envファイルをロード
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: async () => {
        const pool = new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: parseInt(process.env.DB_PORT, 10),
        });
        return pool;
      },
    },
    UserService,
    MicroPostService,
  ],
  controllers: [AppController],
})
export class AppModule {}
