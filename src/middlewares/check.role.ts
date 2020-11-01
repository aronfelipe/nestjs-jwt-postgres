import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { User, UserRole } from 'src/user/user.model';
import { getRepository } from 'typeorm';

import JwtConfig from "../config/jwt.config";

import * as jwt from "jsonwebtoken";


@Injectable()
export class RoleMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: Function) {
    // Get the jwt token from the request header "auth"
    const token = <string>req.headers["afund-api-token"];
    let jwtPayload;

    // Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, JwtConfig.JwtConfig);
    } catch (error) {
        // If token is not valid, respond with 401 (unauthorized)
        throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
    }

    // The token is valid for 1 hour by default. Value is stored in .env
    // We want to send a new token on every request
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(jwtPayload.userId);
    if (user.role == UserRole.ADMIN) {
        next();
    } else {
        throw new HttpException('Usuário não permitido', HttpStatus.UNAUTHORIZED);
    }
  }
}