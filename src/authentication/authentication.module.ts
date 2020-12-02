import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/user.model';
import { AuthenticationController } from './authentication.controller';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [TypeOrmModule.forFeature([ User ]), LoggerModule.forRoot()],
  providers: [],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}