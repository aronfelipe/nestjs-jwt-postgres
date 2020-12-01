import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepository } from "typeorm";
import { User } from './user/user.model';
import * as crypto from "crypto-js";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const userRepository = getRepository(User);
  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  if (await userRepository.findOne({where:{email:"aron"}})) {
    await app.listen(5000);
  } else {
    const salt = Math.random().toString(16);
    const passwordSalt = process.env.PASSWORD || 'aron' + salt;
    const password = crypto.SHA256(passwordSalt).toString();
    await userRepository.insert({email: "aron", password: password, salt: salt, role: "admin"})
    await app.listen(5000);
  }
}

bootstrap();