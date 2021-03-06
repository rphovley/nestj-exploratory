import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyCompress from 'fastify-compress';
import fastifyHelmet from 'fastify-helmet';
import fastifyRateLimit from 'fastify-rate-limit';
import fastifySession from 'fastify-session';
import fastifyCookie from 'fastify-cookie';
import fastifyCors from 'fastify-cors';
import connectRedis from 'connect-redis';
import redis from 'redis';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
          bodyLimit: +process.env.BODY_LIMIT,
          logger: process.env.SERVER_LOGGER,
        }),
    );

  app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
        }),
    );

  app.register(fastifyRateLimit, {
    max: +process.env.MAX_RATE_REQUESTS,
    ban: +process.env.TIMES_BAN_RATE_REQUESTS,
    timeWindow: +process.env.TIME_WINDOW_RATE_LIMIT,
  });

  app.register(fastifyCors, {
    allowedHeaders: process.env.ALLOWED_HEADERS.split(','),
    credentials: true,
    methods: process.env.ALLOWED_METHODS.split(','),
    origin: process.env.ALLOWED_ORIGINS.split(','),
    preflightContinue: false,
  });

  app.register(fastifyHelmet, { hidePoweredBy: true });
  app.register(fastifyCompress);

    // Redis, Session and Cookies
  const redisStoreInstance = connectRedis(fastifySession);
  const redisCli = redis.createClient();
  app.register(fastifyCookie);
  app.register(fastifySession, {
    secret: process.env.SESSION_SECRET,
    store: new redisStoreInstance({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      client: redisCli,
      ttl: process.env.REDIS_TTL,
    }),
    cookie: {
      secure: false,
    },
  });
  return app;
}

export default bootstrap;
