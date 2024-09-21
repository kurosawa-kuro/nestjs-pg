import { Test, TestingModule } from '@nestjs/testing';
import { MicroPostController } from './micropost.controller';
import { MicroPostService } from './micropost.service';
import { UserService } from './user.service';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

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

  it('should return an array of microPosts', async () => {
    const result = await microPostController.getMicroPosts();
    expect(result).toEqual([{ id: 1, userId: 1, title: 'My first micropost' }]);
  });
});