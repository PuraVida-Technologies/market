import { Resolver, Query, Args } from '@nestjs/graphql';
import { MarketplaceCategoryService } from './marketplace-category.service';
import { MarketplaceCategory } from './entities/marketplace-category.entity';
import { AutoCompleteCategoryInput } from './dto/auto-complete.input';

@Resolver(() => MarketplaceCategory)
export class MarketplaceCategoryResolver {
  constructor(
    private readonly marketplaceCategoryService: MarketplaceCategoryService,
  ) {}

  @Query(() => [MarketplaceCategory], {
    name: 'marketplaceAutoCompleteCategory',
  })
  autoComplete(
    @Args('autoCompleteCategoryInput')
    autoCompleteCategoryInput: AutoCompleteCategoryInput,
  ) {
    return this.marketplaceCategoryService.autoComplete(
      autoCompleteCategoryInput,
    );
  }

  @Query(() => [MarketplaceCategory], { name: 'getMarketplaceCategories' })
  findAll() {
    return this.marketplaceCategoryService.findAll();
  }

  @Query(() => MarketplaceCategory, { name: 'getMarketplaceCategory' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.marketplaceCategoryService.findOne(id);
  }
}
