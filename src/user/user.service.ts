import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService extends AbstractService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){
        super(userRepository)
    }

    async findOne(condition, relations = []): Promise<any> {
        return this.repository.findOne({
            where: {email: condition.email}, 
            relations
        })
    }
}
