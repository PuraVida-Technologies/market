import { Resolver, Query, Args } from '@nestjs/graphql';
import { MarketplaceCategoryService } from './marketplace-category.service';
import { MarketplaceCategory } from './entities/marketplace-category.entity';
import { AutoCompleteCategoryInput } from './dto/auto-complete.input';
import { GetAllDto } from '../../common/inputs/get-all.input';

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
  findAll(
    @Args('getMarketPlaceCategoriesInput')
    getMarketPlaceCategoriesInput?: GetAllDto,
  ) {
    return this.marketplaceCategoryService.findAll(
      getMarketPlaceCategoriesInput,
    );
  }

  @Query(() => MarketplaceCategory, { name: 'getMarketplaceCategory' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.marketplaceCategoryService.findOne(id);
  }
}
