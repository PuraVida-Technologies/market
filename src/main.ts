import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  //validation for api endpoints
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));

  //cookie parser for use http only cookie for JWT authentication
  app.use(cookieParser());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({ origin: '*' });
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));

  await app.listen(process.env.PORT, () => {
    console.log(`Application is running on Port: ${process.env.PORT}`);
  });
}
bootstrap();
