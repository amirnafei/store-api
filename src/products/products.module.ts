import { Module } from '@nestjs/common';
import { JsonDbService } from '../json-db/json-db.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, JsonDbService],
})
export class ProductsModule {}
