import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';
import { StoreOneUser } from './body/store.body';
import { ResponseInterface } from 'src/utils/response.interface';

import * as crypto from "crypto-js";

@Controller('user')
export class UserController {
    constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>) {}

    @Get()
    async findAll(): Promise<ResponseInterface> {
        try {
            const response = <ResponseInterface> {
                message: "Find all successful",
                response: await this.userRepository.find(),
                status: 200
              }
            return response;
        } catch (error) {
            return error
        }
    }
    @Post()
    async storeOne(@Body() body: StoreOneUser): Promise<ResponseInterface> {
        try {
            const salt = Math.random().toString(16);
            const passwordSalt = body.password + salt;
            const password = crypto.SHA256(passwordSalt).toString();
            const userInsert = await this.userRepository.insert({
                email: body.email,
                password,
                salt,
                role: body.role
            });
            const userdb = await this.userRepository.findOne(userInsert['identifiers'][0]['id']);
            const response = <ResponseInterface> {
                message: "Store successful",
                response: userdb,
                status: 200
              }
            return response;
        } catch (error) {
            return error
        }
    }
}
