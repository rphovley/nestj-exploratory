import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyCompress from 'fastify-compress';
import fastifyHelmet from 'fastify-helmet';
import fastifyRateLimit from 'fastify-rate-limit';
import fastifySession from 'fastify-session';
import fastifyCookie from 'fastify-cookie';
import connectRedis from 'connect-redis';
import redis from 'redis';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggerService } from './modules/_shared/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 10240,
      logger: process.env.SERVER_LOGGER,
    }),
  );

  // Logger
  app.useLogger(app.get(LoggerService));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.register(fastifyRateLimit, {
    max: 100,
    ban: 10,
    timeWindow: 60 * 1000,
  });

  app.register(require('fastify-cors'), {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: ['http://localhost:8080', 'https://ursul.us'],
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

  // Swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Ursula API')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(3000);
}

bootstrap();
