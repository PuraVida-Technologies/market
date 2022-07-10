import { Resolver, Query, Args, Int } from '@nestjs/graphql';
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

  @Query(() => [MarketplaceCategory], { name: 'marketplaceCategory' })
  findAll() {
    return this.marketplaceCategoryService.findAll();
  }

  @Query(() => MarketplaceCategory, { name: 'marketplaceCategory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.marketplaceCategoryService.findOne(id);
  }
}
