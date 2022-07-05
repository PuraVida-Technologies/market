import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MarketplaceCategoryService } from './marketplace-category.service';
import { MarketplaceCategory } from './entities/marketplace-category.entity';
import { CreateMarketplaceCategoryInput } from './dto/create-marketplace-category.input';
import { UpdateMarketplaceCategoryInput } from './dto/update-marketplace-category.input';

@Resolver(() => MarketplaceCategory)
export class MarketplaceCategoryResolver {
  constructor(
    private readonly marketplaceCategoryService: MarketplaceCategoryService,
  ) {}

  @Mutation(() => MarketplaceCategory)
  createMarketplaceCategory(
    @Args('createMarketplaceCategoryInput')
    createMarketplaceCategoryInput: CreateMarketplaceCategoryInput,
  ) {
    return this.marketplaceCategoryService.create(
      createMarketplaceCategoryInput,
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

  @Mutation(() => MarketplaceCategory)
  updateMarketplaceCategory(
    @Args('updateMarketplaceCategoryInput')
    updateMarketplaceCategoryInput: UpdateMarketplaceCategoryInput,
  ) {
    return this.marketplaceCategoryService.update(
      updateMarketplaceCategoryInput.id,
      updateMarketplaceCategoryInput,
    );
  }

  @Mutation(() => MarketplaceCategory)
  removeMarketplaceCategory(@Args('id', { type: () => Int }) id: number) {
    return this.marketplaceCategoryService.remove(id);
  }
}
