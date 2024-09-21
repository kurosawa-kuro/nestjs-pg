import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { MicroPostService } from './micropost.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly microPostService: MicroPostService,
  ) {}

  @Post('user')
  async createUser(@Body('name') name: string) {
    await this.userService.createUser(name);
    return { message: 'User created' };
  }

  @Get('users')
  async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  @Post('micropost')
  async createMicroPost(
    @Body('userId') userId: number,
    @Body('title') title: string,
  ) {
    await this.microPostService.createMicroPost(userId, title);
    return { message: 'MicroPost created' };
  }

  @Get('microposts')
  async getMicroPosts() {
    const microposts = await this.microPostService.getMicroPosts();
    return microposts;
  }
}
