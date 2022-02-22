import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { v4 as uuid } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { JsonDbService } from '../json-db/json-db.service';

@Injectable()
export class ProductsService {
  constructor(private readonly jsonDB: JsonDbService) {}

  read(productIds: string[]): Product[] {
    try {
      const products = productIds.map((productId) =>
        this.jsonDB.read<Product>(`/products/${productId}`),
      );
      if (products.filter(p => p.deleted).length) throw new NotFoundException();
      return products;
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  upsert(products: CreateProductDto[]): string[] {
    const productIds = [];
    products.forEach((p) => {
      try {
        if (!p.productId) throw new NotFoundException();
        this.jsonDB.read(`/products/${p.productId}`);
        this.jsonDB.upsert(`/products/${p.productId}`, {
          ...p,
          deleted: false,
        });
        productIds.push(p.productId);
      } catch (e) {
        const productId = uuid();
        this.jsonDB.upsert(`/products/${productId}`, {
          ...p,
          productId,
          deleted: false,
        });
        productIds.push(productId);
      }
    });
    return productIds;
  }

  delete(productIds: string[]): void {
    try {
      productIds.map((productId) => {
        const product = this.jsonDB.read<Product>(`/products/${productId}`);
        if (product)
          this.jsonDB.upsert(`/products/${productId}`, {
            ...product,
            deleted: true,
          });
      });
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }
}
