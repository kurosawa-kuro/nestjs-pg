import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService, User } from './user.service';
import { MicroPostService } from './micropost.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly microPostService: MicroPostService,
  ) {}

  @Post('user')
  async createUser(@Body('name') name: string): Promise<{ message: string }> {
    await this.userService.createUser(name);
    return { message: 'User created' };
  }

  @Get('users')
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Post('micropost')
  async createMicroPost(
    @Body('userId') userId: number,
    @Body('title') title: string,
  ): Promise<{ message: string }> {
    await this.microPostService.createMicroPost(userId, title);
    return { message: 'MicroPost created' };
  }

  @Get('microposts')
  async getMicroPosts() {
    return await this.microPostService.getMicroPosts();
  }
}