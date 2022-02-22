import { Test, TestingModule } from '@nestjs/testing';
import { JsonDbService } from './json-db.service';

describe('JsonDbService', () => {
  let service: JsonDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonDbService],
    }).compile();

    service = module.get<JsonDbService>(JsonDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
