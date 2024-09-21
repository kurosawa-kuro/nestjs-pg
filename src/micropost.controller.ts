import { Controller, Get, Post, Body } from '@nestjs/common';
import { MicroPostService } from './micropost.service';

@Controller('microposts')
export class MicroPostController {
  constructor(private readonly microPostService: MicroPostService) {}

  @Post()
  async createMicroPost(
    @Body('userId') userId: number,
    @Body('title') title: string,
  ) {
    await this.microPostService.createMicroPost(userId, title);
    return { message: 'MicroPost created' };
  }

  @Get()
  async getMicroPosts() {
    const microposts = await this.microPostService.getMicroPosts();
    return microposts;
  }
}
