import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UserService } from './user.service';
import { MicroPostService } from './micropost.service';

describe('AppController', () => {
  let appController: AppController;
  let userService: UserService;
  let microPostService: MicroPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getUsers: jest.fn().mockResolvedValue([{ id: 1, name: 'John Doe' }]),
          },
        },
        {
          provide: MicroPostService,
          useValue: {
            createMicroPost: jest.fn(),
            getMicroPosts: jest.fn().mockResolvedValue([{ id: 1, userId: 1, title: 'My first micropost' }]),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    userService = module.get<UserService>(UserService);
    microPostService = module.get<MicroPostService>(MicroPostService);
  });

  describe('createUser', () => {
    it('should call createUser and return success message', async () => {
      const result = await appController.createUser('John Doe'); // 修正: 文字列を直接渡す
      expect(userService.createUser).toHaveBeenCalledWith('John Doe');
      expect(result).toEqual({ message: 'User created' });
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const result = await appController.getUsers();
      expect(result).toEqual([{ id: 1, name: 'John Doe' }]);
    });
  });

  describe('createMicroPost', () => {
    it('should call createMicroPost and return success message', async () => {
      const result = await appController.createMicroPost(1, 'My first micropost'); // 修正: 引数を分けて渡す
      expect(microPostService.createMicroPost).toHaveBeenCalledWith(1, 'My first micropost');
      expect(result).toEqual({ message: 'MicroPost created' });
    });
  });

  describe('getMicroPosts', () => {
    it('should return an array of microposts', async () => {
      const result = await appController.getMicroPosts();
      expect(result).toEqual([{ id: 1, userId: 1, title: 'My first micropost' }]);
    });
  });
});
