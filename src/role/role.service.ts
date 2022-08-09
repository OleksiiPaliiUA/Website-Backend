import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './models/role.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>
    ) {}

    async all(): Promise<Role[]> {
        return this.roleRepository.find()
    }

    async create(data): Promise<Role> {
        return this.roleRepository.save(data)
    }

    async findOne(condition): Promise<Role> {
        return this.roleRepository.findOne({
            where: {id: condition.id}, 
            relations: ['permissions']
        })
    }

    async update(id: number, data): Promise<any> {
        return this.roleRepository.update(id, data)
    }

    async delete(id: number){
        return this.roleRepository.delete(id)
    }
}
