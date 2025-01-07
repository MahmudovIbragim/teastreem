import { NestFactory } from '@nestjs/core';
import { default as RedisStore } from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { CoreModule } from './core/core.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ms, type StringValue } from './shared/utils/ms.util';
import { parseBoolean } from './shared/utils/parse-boolean.util';
import { RedisService } from './core/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  const config = app.get(ConfigService);
  const redis = app.get(RedisService);

  app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      secret: config.getOrThrow<number>('SESSION_SECRET'),
      name: config.getOrThrow<number>('SESSION_NAME'),
      resave: false,
      saveUnitialized: false,
      cookie: {
        domain: config.getOrThrow<number>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<number>('SESSION_FOLDER'),
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
bootstrap();
