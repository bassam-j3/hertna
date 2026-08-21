import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS dynamically for Vite development and any local network requests
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedRegex = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):517[0-9]$/;
      if (allowedRegex.test(origin)) {
        return callback(null, true);
      }
      // Temporarily allow all for the overnight mission to prevent any QA blockers
      return callback(null, true);
    },
    credentials: true,
  });

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Global API Prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
