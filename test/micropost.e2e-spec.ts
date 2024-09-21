import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserService } from './../src/user.service';
import { MicroPostService } from './../src/micropost.service';

describe('MicroPostController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let micropostService: MicroPostService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    micropostService = moduleFixture.get<MicroPostService>(MicroPostService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a micropost (POST /microposts)', async () => {
    // ユーザーを作成
    const user = await userService.createUser('Test User');

    const response = await request(app.getHttpServer())
      .post('/microposts')
      .send({ userId: user.id, title: 'My first micropost' })
      .expect(201);

    expect(response.body).toEqual({ message: 'MicroPost created' });
  });

  it('should retrieve all microposts (GET /microposts)', async () => {
    // テスト用のユーザーとマイクロポストを作成
    const user = await userService.createUser('Another Test User');
    await micropostService.createMicroPost(user.id, 'Test micropost');

    const response = await request(app.getHttpServer())
      .get('/microposts')
      .expect(200);

    expect(response.body).toEqual(expect.any(Array));
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('title', 'Test micropost');
  });
});