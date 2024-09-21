import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { MicroPostController } from './micropost.controller';
import { UserService } from './user.service';
import { MicroPostService } from './micropost.service';


describe('MicroPostController', () => {
  let microPostController: MicroPostController;
  let microPostService: MicroPostService;

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
      ],
    }).compile();

    microPostController = module.get<MicroPostController>(MicroPostController);
    microPostService = module.get<MicroPostService>(MicroPostService);
  });

  it('should create a microPost and return a success message', async () => {
    const result = await microPostController.createMicroPost(1, 'My first micropost');
    expect(microPostService.createMicroPost).toHaveBeenCalledWith(1, 'My first micropost');
    expect(result).toEqual({ message: 'MicroPost created' });
  });

  it('should return an array of microPosts', async () => {
    const result = await microPostController.getMicroPosts();
    expect(result).toEqual([{ id: 1, userId: 1, title: 'My first micropost' }]);
  });
});
