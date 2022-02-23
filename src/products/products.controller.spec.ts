import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;
  
  const products = [
    {productId: '1', name: 'product 1', price: 1, deleted: false},
    {productId: '2', name: 'product 2', price: 2, deleted: true},
    {productId: '3', name: 'product 3', price: 3, deleted: false},
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
    .overrideProvider(ProductsService)
    .useValue({read: jest.fn(() => products), upsert: jest.fn(), delete: jest.fn()})
    .compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should read', () => {
    expect(productsService.read).not.toBeCalled();
    const result = controller.read(['1', '2', '3']);
    expect(productsService.read).toBeCalledTimes(1);
    expect(productsService.read).toBeCalledWith(['1', '2', '3']);
    expect(result).toEqual(products);
  });

  it('should upsert', () => {
    expect(productsService.upsert).not.toBeCalled();
    const products = [
      {productId: '1', name: 'product1', price: 1, deleted: false},
      {productId: '2', name: 'product2', price: 2, deleted: false}
    ];
    const result = controller.upsert(products);
    expect(productsService.upsert).toBeCalledTimes(1);
    expect(productsService.upsert).toBeCalledWith(products);
  });

  it('should delete', () => {
    expect(productsService.delete).not.toBeCalled();
    const result = controller.delete(['1', '2']);
    expect(productsService.delete).toBeCalledTimes(1);
    expect(productsService.delete).toBeCalledWith(['1', '2']);
  });
});
