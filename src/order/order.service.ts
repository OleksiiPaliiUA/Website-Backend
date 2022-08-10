import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Order } from './models/order.entity';

@Injectable()
export class OrderService extends AbstractService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ){
        super(orderRepository)
    }

    async paginate(page: number = 1, relations = []){
        const {data, meta} = await super.paginate(page, relations)
        
        return {
            data: data.map((order: Order) => ({
                id: order.id,
                name: order.name,
                email: order.email,
                total: order.total,
                created_at: order.created_at,
                order_items: order.order_items
            })),
            meta
        }
    }

    async chart(){
        return this.orderRepository.query(`
            SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, sum(i.price * i.quantity) as total
            FROM orders o
            JOIN order_items i on o.id = i.order_id 
            GROUP BY date 
        `)
    }
}
