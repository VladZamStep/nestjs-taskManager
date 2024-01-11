import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as config from 'config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');

async function bootstrap() {
  const serverConfig = config.get('server');

  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  const logger = new Logger('bootstrap');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tasks example')
    .setDescription('The tasks API description')
    .setVersion(packageJson.version)
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Tasks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
  logger.log(`Swagger started at: http://${serverConfig.host}:${port}/api`);
}
bootstrap();
