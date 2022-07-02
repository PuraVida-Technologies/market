import { Test, TestingModule } from '@nestjs/testing';
import { MarketplacePostResolver } from './marketplace-post.resolver';
import { MarketplacePostService } from './marketplace-post.service';

describe('MarketplacePostResolver', () => {
  let resolver: MarketplacePostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketplacePostResolver, MarketplacePostService],
    }).compile();

    resolver = module.get<MarketplacePostResolver>(MarketplacePostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
