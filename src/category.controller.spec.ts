import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            createCategory: jest.fn(),
            getCategories: jest.fn().mockResolvedValue([{ id: 1, title: 'Technology' }]),
          },
        },
      ],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should create a category and return a success message', async () => {
    const title = 'Technology';
    const result = await categoryController.createCategory(title);
    expect(categoryService.createCategory).toHaveBeenCalledWith(title);
    expect(result).toEqual({ message: 'Category created' });
  });

  it('should return an array of categories', async () => {
    const result = await categoryController.getCategories();
    expect(result).toEqual([{ id: 1, title: 'Technology' }]);
  });
});
