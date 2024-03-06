import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function bootstrap() {

  const httpsOptions = {
    key: fs.readFileSync('certs/ipms.privkey.pem'),
    cert: fs.readFileSync('certs/ipms.fullchain.pem'),
  };


  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const config = new DocumentBuilder()
    .setTitle('Georefering API')
    .setDescription('Georefering API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(3002);
}
bootstrap();
