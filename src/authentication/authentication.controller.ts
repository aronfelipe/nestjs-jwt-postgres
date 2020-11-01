import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticationUser } from './body/authentication.body';
import { User, UserRole } from 'src/user/user.model';

import JwtConfig from "../config/jwt.config";

import * as jwt from "jsonwebtoken";
import * as crypto from "crypto-js";
import { ResponseInterface } from 'src/utils/response.interface';

@Controller("auth")
export class AuthenticationController {
  constructor(@InjectRepository(User)
  private userRepository: Repository<User>) {}

  @Post("register")
  async register(@Body() user: AuthenticationUser): Promise<ResponseInterface> {
    try {
      // TODO tratar erro de usuário com mesmo email
        const salt = Math.random().toString(16);
        const passwordSalt = user.password + salt;
        const password = crypto.SHA256(passwordSalt).toString();
        const userInsert = await this.userRepository.insert({
            email: user.email,
            password,
            salt,
            role: UserRole.CONSUMER
        });
        const userdb = await this.userRepository.findOne(userInsert['identifiers'][0]['id']);
        const response = <ResponseInterface> {
            message: "Register successful",
            response: userdb,
            status: 200
        }
        return response;
    }
    catch (error) {
        return error
    }
  }

  @Post("login")
  async login(@Body() user: AuthenticationUser) : Promise<ResponseInterface> {
    try {
      const userdb = await this.userRepository.findOne({where:{email: user.email}});
      if (userdb) {
        const passwordSalt = user.password + userdb.salt;
        const password = crypto.SHA256(passwordSalt).toString();
        if (password == userdb.password) {
          const userId = userdb.id;
          const token = jwt.sign({ userId }, JwtConfig.JwtConfig, {
            expiresIn: 60*15
          });
          const response = <ResponseInterface> {
            message: "Login successful",
            response: token,
            status: 200
          }
          return response;
        } else {
          throw new HttpException('Esse usuário não tem essa senha', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('Esse usuário não existe', HttpStatus.NOT_FOUND);
      }
    }
    catch (error) {
        return error
    }
  }
}