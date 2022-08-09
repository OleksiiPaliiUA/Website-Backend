import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request  } from 'express';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService){
    }

    async userId(request: Request): Promise<number>{
        const data = await this.jwtService.verifyAsync(request.cookies['auth'])
        return data['id']
    }
}
