import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/user.model';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ User ])],
  providers: [],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}