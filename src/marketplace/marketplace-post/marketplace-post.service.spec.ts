import { Test, TestingModule } from '@nestjs/testing';
import { MarketplacePostService } from './marketplace-post.service';

describe('MarketplacePostService', () => {
  let service: MarketplacePostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketplacePostService],
    }).compile();

    service = module.get<MarketplacePostService>(MarketplacePostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
