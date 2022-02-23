import { Test, TestingModule } from '@nestjs/testing';
import { JsonDbService } from '../json-db/json-db.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let jsonDbService: JsonDbService;

  const products = {
    '/products/1': {productId: '1', name: 'product 1', price: 1, deleted: false},
    '/products/2': {productId: '2', name: 'product 2', price: 2, deleted: true},
    '/products/3': {productId: '3', name: 'product 3', price: 3, deleted: false},
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, JsonDbService],
    })
    .overrideProvider(JsonDbService)
    .useValue({read: jest.fn((key) => products[key]), upsert: jest.fn()})
    .compile();

    productsService = module.get<ProductsService>(ProductsService);
    jsonDbService = module.get<JsonDbService>(JsonDbService);
  });

  it('should read json', () => {
    expect(jsonDbService.read).not.toBeCalled();
    const result = productsService.read(['1', '3']);
    expect(jsonDbService.read).toBeCalledTimes(2);
    expect(jsonDbService.read).toBeCalledWith('/products/1');
    expect(jsonDbService.read).toBeCalledWith('/products/3');
  });

  it('should throw exception on reading invalid/deleted product', () => {
    try {
      productsService.read(['1', '2']);
    } catch (e) { expect(e.status).toBe(404); }
  });
});
