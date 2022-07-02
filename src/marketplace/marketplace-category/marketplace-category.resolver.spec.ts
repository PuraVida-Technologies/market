import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceCategoryResolver } from './marketplace-category.resolver';
import { MarketplaceCategoryService } from './marketplace-category.service';

describe('MarketplaceCategoryResolver', () => {
  let resolver: MarketplaceCategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketplaceCategoryResolver, MarketplaceCategoryService],
    }).compile();

    resolver = module.get<MarketplaceCategoryResolver>(MarketplaceCategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
