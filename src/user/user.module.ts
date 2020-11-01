import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [],
  controllers: [UserController],
})
export class UserModule {}