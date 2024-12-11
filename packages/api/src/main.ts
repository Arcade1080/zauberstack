import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app/app.module';

export function addAppPipesAndFilters(app: INestApplication): void {
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Needed for Stripe Webhooks
  const rawBodyBuffer = (req, _res, buffer, encoding) => {
    if (!req.headers['stripe-signature']) {
      return;
    }

    if (buffer && buffer.length) {
      req.rawBody = buffer.toString(encoding || 'utf8');
    }
  };

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  //app.useGlobalPipes(new CustomValidationPipe());
  app.use(cookieParser());

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get('nest');
  const corsConfig = configService.get('cors');

  // Cors
  if (corsConfig.enabled) {
    app.enableCors({
      credentials: true,
      origin: configService.get('WEB_CLIENT_URL'),
    });
  }

  await app.listen(process.env.PORT || nestConfig.port || 3000);
}
bootstrap();
