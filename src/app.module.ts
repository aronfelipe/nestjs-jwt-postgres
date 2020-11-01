import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.model';
import { AuthenticationModule } from './authentication/authentication.module';
import { TokenMiddleware } from './middlewares/check.jwt';
import { RoleMiddleware } from './middlewares/check.role';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || "", 10),
    username: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE_NAME,
    entities: [User],
    synchronize: true,
  }), AuthenticationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware, RoleMiddleware)
      .forRoutes('user')
  }
}
