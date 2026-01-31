import "reflect-metadata";

import { config } from "@loadforge/config";

import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

import helmet from "@fastify/helmet";

import { HttpExceptionFilter } from "@loadforge/common";

import { AppModule } from "./app.module";

async function bootstrap() {
  const corsOrigins = config.CORS_ORIGINS.split(",").map((s) => s.trim());
  const adapter = new FastifyAdapter();
  adapter.enableCors({
    origin:
      corsOrigins.length === 1 && corsOrigins[0] === "*" ? true : corsOrigins,
    credentials: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  app.setGlobalPrefix("api/v1");

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const fastify = app.getHttpAdapter().getInstance();
  await fastify.register(
    helmet as unknown as Parameters<typeof fastify.register>[0],
    {
      contentSecurityPolicy: false,
    },
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("LoadForge API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  const port = Number(config.GATEWAY_PORT);
  await app.listen(port, "0.0.0.0");
}

bootstrap();
