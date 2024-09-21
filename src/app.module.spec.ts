import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { UserService } from './user.service';
import { MicroPostService } from './micropost.service';
import { CategoryService } from './category.service';
import { UserController } from './user.controller';
import { MicroPostController } from './micropost.controller';
import { CategoryController } from './category.controller';
import { Pool } from 'pg';

jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have UserService provider', () => {
    const userService = module.get<UserService>(UserService);
    expect(userService).toBeInstanceOf(UserService);
  });

  it('should have MicroPostService provider', () => {
    const microPostService = module.get<MicroPostService>(MicroPostService);
    expect(microPostService).toBeInstanceOf(MicroPostService);
  });

  it('should have CategoryService provider', () => {
    const categoryService = module.get<CategoryService>(CategoryService);
    expect(categoryService).toBeInstanceOf(CategoryService);
  });

  it('should have UserController', () => {
    const userController = module.get<UserController>(UserController);
    expect(userController).toBeInstanceOf(UserController);
  });

  it('should have MicroPostController', () => {
    const microPostController = module.get<MicroPostController>(MicroPostController);
    expect(microPostController).toBeInstanceOf(MicroPostController);
  });

  it('should have CategoryController', () => {
    const categoryController = module.get<CategoryController>(CategoryController);
    expect(categoryController).toBeInstanceOf(CategoryController);
  });

  it('should have DATABASE_POOL provider', () => {
    const databasePool = module.get<Pool>('DATABASE_POOL');
    expect(databasePool).toBeDefined();
    expect(databasePool.connect).toBeDefined();
    expect(databasePool.query).toBeDefined();
    expect(databasePool.end).toBeDefined();
  });
});