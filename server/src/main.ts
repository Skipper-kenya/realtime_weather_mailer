import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { constants } from './users/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URI,
    credentials: true
  });
  app.use(cookieParser());
  app.use(
    session({
      secret: constants.secret,
      saveUninitialized: true,
      resave: false
    })
  );

  await app.listen(3002);
}
bootstrap();
