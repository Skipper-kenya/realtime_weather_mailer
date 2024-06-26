import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request, @Res() res: any) {
    // // return req.user;
    res.cookie('jwt', req.user, {
      httpOnly: true,
      maxAge: 3600000
    });
    return res.send({
      success: true,
      message: 'successfully logged in',
      jwt: req.user
    });
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return { ...req.user, isAuthenticated: req.isAuthenticated() };
  }

  @Post('logout')
  @UseGuards(LocalGuard)
  logout(@Req() req: any): void {}
}
