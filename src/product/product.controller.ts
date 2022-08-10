import { 
    Body,
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post, 
    Put, 
    Query, 
    UseGuards 
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { HasPermission } from 'src/permission/has-permission.decorator';
import { ProductCreateDto } from './models/product-create.dto';
import { ProductService } from './product.service';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService){
    }

    @Get()
    @HasPermission('view_products')
    async all(@Query('page') page: number = 1){
        return this.productService.paginate()
    }

    @Post()
    @HasPermission('edit_products')
    async create(@Body() body: ProductCreateDto){
        return this.productService.create(body)
    }

    @Get(':id')
    @HasPermission('view_products')
    async get(@Param('id') id: number){
        return this.productService.findOne({id})
    }

    @Put(':id')
    @HasPermission('edit_products')
    async update(
        @Param('id') id: number,
        @Body() body: ProductCreateDto
    ){
        await this.productService.update(id, body)
        return this.productService.findOne({id})
    }

    @Delete(':id')
    @HasPermission('edit_products')
    async delete(@Param('id') id: number){
        return this.productService.delete(id)
    }
}
