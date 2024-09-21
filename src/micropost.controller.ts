// micropost.controller.ts
import { Controller, Get, Post, Body, InternalServerErrorException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { MicroPostService } from './micropost.service';
import { UserService } from './user.service';

@Controller('microposts')
export class MicroPostController {
  private readonly logger = new Logger(MicroPostController.name);

  constructor(
    private readonly microPostService: MicroPostService,
    private readonly userService: UserService
  ) {}

  @Post()
  async createMicroPost(
    @Body('userId') userId: number,
    @Body('title') title: string,
  ) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const micropost = await this.microPostService.createMicroPost(userId, title);
      return { message: 'MicroPost created', micropost };
    } catch (error) {
      this.logger.error(`Failed to create micropost: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.constraint === 'micropost_user_id_fkey') {
        throw new BadRequestException(`User with id ${userId} does not exist`);
      }
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