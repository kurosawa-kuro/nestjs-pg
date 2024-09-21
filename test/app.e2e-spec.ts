import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Pool } from 'pg';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let pool: Pool;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // データベース接続を取得
    pool = app.get('DATABASE_POOL');
  });

  afterAll(async () => {
    await pool.end(); // データベース接続を終了
    await app.close(); // アプリケーションを終了
  });

  it('should create a user (POST /user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/user')
      .send({ name: 'John Doe' })
      .expect(201); // Created status

    expect(response.body).toEqual({ message: 'User created' });
  });

  it('should retrieve all users (GET /users)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toEqual(expect.any(Array));
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('name', 'John Doe');
  });

  it('should create a micropost (POST /micropost)', async () => {
    const response = await request(app.getHttpServer())
      .post('/micropost')
      .send({ userId: 1, title: 'My first micropost' })
      .expect(201); // Created status

    expect(response.body).toEqual({ message: 'MicroPost created' });
  });

  it('should retrieve all microposts (GET /microposts)', async () => {
    const response = await request(app.getHttpServer())
      .get('/microposts')
      .expect(200);

    expect(response.body).toEqual(expect.any(Array));
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('title', 'My first micropost');
  });
});
