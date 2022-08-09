import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { Product } from './models/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CommonModule
  ],
  controllers: [ProductController, UploadController],
  providers: [ProductService]
})
export class ProductModule {}
