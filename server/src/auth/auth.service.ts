import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser = await this.usersService.signin(username);
    if (!findUser) return null;
    if (bcrypt.compareSync(password, findUser?.password)) {
      const { password, ...user } = findUser;
      return this.jwtService.sign(user);
    }
  }
}
