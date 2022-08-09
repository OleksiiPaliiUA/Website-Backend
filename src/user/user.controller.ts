import { 
    BadRequestException,
    Body, 
    ClassSerializerInterceptor, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post, 
    Put, 
    Query, 
    Req, 
    UseGuards, 
    UseInterceptors 
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs'
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private authService: AuthService){
    }

    @Get()
    async all(@Query('page') page: number = 1) {
        return this.userService.paginate(page, ['role'])
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User> {
        const {role_id, ...data} = body
        return this.userService.create({
            ...data,
            password: await bcrypt.hash(body.password, 12),
            role: {id: body.role_id}
        })
    }

    @Get(':id')
    async get(@Param('id') id: number){
        return this.userService.findOne({id}, ['role'])
    }

    @Put('info')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UserUpdateDto
    ) {
        const id = await this.authService.userId(request)
        await this.userService.update(id, body)
        return this.userService.findOne({id}, ['role'])
    }

    @Put('password')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string
    ) {
        if(password != password_confirm) {
            throw new BadRequestException('Passwords do not match')
        }
        const id = await this.authService.userId(request)
        await this.userService.update(id, {
            password: await bcrypt.hash(password, 12)
        })
        return this.userService.findOne({id}, ['role'])
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: UserUpdateDto
    ){
        const {role_id, ...data} = body
        await this.userService.update(id, {
            ...data,
            role: {id: role_id}
        })
        return this.userService.findOne({id})
    }

    @Delete(':id')
    async delete(@Param('id') id: number){
        return this.userService.delete(id)
    }
}
