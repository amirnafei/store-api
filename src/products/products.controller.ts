import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  read(@Query('productIds') productIds: string[]): Product[] {
    return this.productService.read([productIds].flat());
  }

  @Post()
  upsert(@Body() products: CreateProductDto[]): string[] {
    return this.productService.upsert(products);
  }
  @Delete()
  delete(@Query('productIds') productIds: string[]): void {
    this.productService.delete([productIds].flat());
  }
}
