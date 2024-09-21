import { Controller, Get, Post, Body, InternalServerErrorException, Logger } from '@nestjs/common';
import { MicroPostService } from './micropost.service';

@Controller('microposts')
export class MicroPostController {
  private readonly logger = new Logger(MicroPostController.name);

  constructor(private readonly microPostService: MicroPostService) {}

  @Post()
  async createMicroPost(
    @Body('userId') userId: number,
    @Body('title') title: string,
  ) {
    try {
      await this.microPostService.createMicroPost(userId, title);
      return { message: 'MicroPost created' };
    } catch (error) {
      this.logger.error(`Failed to create micropost: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create micropost');
    }
  }

  @Get()
  async getMicroPosts() {
    try {
      const microposts = await this.microPostService.getMicroPosts();
      return microposts;
    } catch (error) {
      this.logger.error(`Failed to get microposts: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to get microposts');
    }
  }
}