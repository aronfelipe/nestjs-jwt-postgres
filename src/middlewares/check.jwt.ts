import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import JwtConfig from "../config/jwt.config";

import * as jwt from "jsonwebtoken";

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    // Get the jwt token from the request header "auth"
    const token = <string>req.headers["afund-api-token"];
    let jwtPayload;

    // Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, JwtConfig.JwtConfig);
        res.locals.userId = jwtPayload.userId;
    } catch (error) {
        // If token is not valid, respond with 401 (unauthorized)
        throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
    }

    // The token is valid for 1 hour by default. Value is stored in .env
    // We want to send a new token on every request
    const { userId } = jwtPayload;
    const newToken = jwt.sign({ userId }, JwtConfig.JwtConfig, {
      expiresIn: 60*15
    });
    res.locals.token = newToken

    // Call the next middleware or controller
    next();
  }
}