import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express'
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto'
import { AuthGuard } from './auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService) {
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if(body.password != body.password_confirm) {
            throw new BadRequestException('Passwords do not match')
        }
        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: await bcrypt.hash(body.password, 12),
            role: {id: 1}
        })
    }

    @Post('login')
    async login(@Body() body: LoginDto, @Res({passthrough: true}) response: Response){
        let user = await this.userService.findOne({email: body.email})
        if(!user){
            throw new NotFoundException('User not found')
        }
        if(!await bcrypt.compare(body.password, user.password)){
            throw new BadRequestException('Invalid credentials')
        }

        //let jwt = await this.jwtService.signAsync({id: user.id})

        response.cookie('auth', await this.jwtService.signAsync({id: user.id}), {httpOnly: true})

        return user
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request){
        let data = await this.jwtService.verifyAsync(request.cookies['auth'])
        return this.userService.findOne({id: data.id})
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response){
        response.clearCookie('auth')
        return {
            message: 'Success'
        }
    }
}
