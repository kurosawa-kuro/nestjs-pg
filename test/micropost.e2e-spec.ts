
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('MicroPostController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a micropost (POST /microposts)', async () => {
    const response = await request(app.getHttpServer())
      .post('/microposts')
      .send({ userId: 1, title: 'My first micropost' })
      .expect(201);

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
