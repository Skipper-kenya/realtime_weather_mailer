import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from './schema/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() details, @Res() res: any): Promise<any> {
    return this.usersService.createUser(details, res);
  }
}
