import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JsonDbService } from '../json-db/json-db.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let jsonDBService: JsonDbService;
  let products;

  beforeEach(() => {
    jsonDBService = new JsonDbService();
    productsService = new ProductsService(jsonDBService);

    products = [
      {productId: '1', name: 'product 1', price: 1, deleted: false},
      {productId: '2', name: 'product 2', price: 2, deleted: true},
      {productId: '3', name: 'product 3', price: 3, deleted: false},
    ]

    jest.spyOn(jsonDBService, 'read').mockImplementation(key => {
      const product = products.find(p => !p.deleted && `/products/${p.productId}` === key);
      if (product) return product;
      throw new NotFoundException();
    });
    
    jest.spyOn(jsonDBService, 'upsert').mockImplementation((key, product: CreateProductDto) => {
      const productIndex = products.findIndex(p => `/products/${p.productId}` === key);
      if (productIndex !== -1) products[productIndex] = { ...product, deleted: false };
      else products.push(product);
    });
  });

  it('should fetch products by id', () => {
    const [product1, product3] = productsService.read(['1', '3']);
    expect(product1).toStrictEqual({productId: '1', name: 'product 1', price: 1, deleted: false});
    expect(product3).toStrictEqual({productId: '3', name: 'product 3', price: 3, deleted: false});
  });

  it('should throw exception on invalid product id', () => {
    try {
      productsService.read(['1', '2']);
    } catch (e) { expect(e.status).toBe(404); }
  });

  it('should insert/update products', () => {
    const productIds = productsService.upsert([{ productId: '1', name: 'updated product 1', price: 11, deleted: false }, { productId: '2', name: 'restored product 2', price: 2, deleted: false }]);
    const [product1, product2, product3] = productsService.read(['1', productIds[1], '3']);
    expect(product1).toStrictEqual({productId: '1', name: 'updated product 1', price: 11, deleted: false});
    expect(product2).toStrictEqual({productId: productIds[1], name: 'restored product 2', price: 2, deleted: false});
    expect(product3).toStrictEqual({productId: '3', name: 'product 3', price: 3, deleted: false});
  });

  it('should delete products', () => {
    productsService.delete(['1', '3']);
    try {
      productsService.read(['1']);
    } catch (e) { expect(e.status).toBe(404); }
    try {
      productsService.read(['3']);
    } catch (e) { expect(e.status).toBe(404); }
  });
});
