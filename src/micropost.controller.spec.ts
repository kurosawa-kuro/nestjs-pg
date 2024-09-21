import { Test, TestingModule } from '@nestjs/testing';
import { MicroPostController } from './micropost.controller';
import { MicroPostService } from './micropost.service';
import { UserService } from './user.service';
import { NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';

describe('MicroPostController', () => {
  let microPostController: MicroPostController;
  let microPostService: MicroPostService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicroPostController],
      providers: [
        {
          provide: MicroPostService,
          useValue: {
            createMicroPost: jest.fn(),
            getMicroPosts: jest.fn().mockResolvedValue([{ id: 1, userId: 1, title: 'My first micropost' }]),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    microPostController = module.get<MicroPostController>(MicroPostController);
    microPostService = module.get<MicroPostService>(MicroPostService);
    userService = module.get<UserService>(UserService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {}); // ロガーのモック
  });

  it('should create a microPost and return a success message', async () => {
    const userId = 1;
    const title = 'My first micropost';
    const micropost = { id: 1, userId, title };

    jest.spyOn(userService, 'getUserById').mockResolvedValue({ id: userId, name: 'Test User' });
    jest.spyOn(microPostService, 'createMicroPost').mockResolvedValue(micropost);

    const result = await microPostController.createMicroPost(userId, title);
    expect(userService.getUserById).toHaveBeenCalledWith(userId);
    expect(microPostService.createMicroPost).toHaveBeenCalledWith(userId, title);
    expect(result).toEqual({ message: 'MicroPost created', micropost });
  });

  it('should throw NotFoundException when user is not found', async () => {
    const userId = 999;
    const title = 'My first micropost';

    jest.spyOn(userService, 'getUserById').mockResolvedValue(null);

    await expect(microPostController.createMicroPost(userId, title)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when user does not exist (foreign key constraint)', async () => {
    const userId = 1;
    const title = 'My first micropost';

    jest.spyOn(userService, 'getUserById').mockResolvedValue({ id: userId, name: 'Test User' });
    jest.spyOn(microPostService, 'createMicroPost').mockRejectedValue({ constraint: 'micropost_user_id_fkey' });

    await expect(microPostController.createMicroPost(userId, title)).rejects.toThrow(BadRequestException);
    await expect(microPostController.createMicroPost(userId, title)).rejects.toThrow(`User with id ${userId} does not exist`);
  });

  it('should throw InternalServerErrorException when micropost creation fails', async () => {
    const userId = 1;
    const title = 'My first micropost';

    jest.spyOn(userService, 'getUserById').mockResolvedValue({ id: userId, name: 'Test User' });
    jest.spyOn(microPostService, 'createMicroPost').mockRejectedValue(new Error('Database error'));

    await expect(microPostController.createMicroPost(userId, title)).rejects.toThrow(InternalServerErrorException);
    await expect(microPostController.createMicroPost(userId, title)).rejects.toThrow('Failed to create micropost');
  });

  it('should return an array of microPosts', async () => {
    const result = await microPostController.getMicroPosts();
    expect(result).toEqual([{ id: 1, userId: 1, title: 'My first micropost' }]);
  });

  it('should throw InternalServerErrorException when getting microposts fails', async () => {
    jest.spyOn(microPostService, 'getMicroPosts').mockRejectedValue(new Error('Database error'));

    await expect(microPostController.getMicroPosts()).rejects.toThrow(InternalServerErrorException);
    await expect(microPostController.getMicroPosts()).rejects.toThrow('Failed to get microposts');
  });
});