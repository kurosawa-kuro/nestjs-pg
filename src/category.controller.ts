import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body('title') title: string) {
    await this.categoryService.createCategory(title);
    return { message: 'Category created' };
  }

  @Get()
  async getCategories() {
    const categories = await this.categoryService.getCategories();
    return categories;
  }
}
