import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MarketplacePostService } from './marketplace-post.service';
import { MarketplacePost } from './entities/marketplace-post.entity';
import { CreateMarketplacePostInput } from './dto/create-marketplace-post.input';
import { UpdateMarketplacePostInput } from './dto/update-marketplace-post.input';

@Resolver(() => MarketplacePost)
export class MarketplacePostResolver {
  constructor(
    private readonly marketplacePostService: MarketplacePostService,
  ) {}

  @Mutation(() => MarketplacePost)
  createMarketplacePost(
    @Args('createMarketplacePostInput')
    createMarketplacePostInput: CreateMarketplacePostInput,
  ) {
    return this.marketplacePostService.create(createMarketplacePostInput);
  }

  @Query(() => [MarketplacePost], { name: 'marketplacePost' })
  findAll() {
    return this.marketplacePostService.findAll();
  }

  @Query(() => MarketplacePost, { name: 'marketplacePost' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.marketplacePostService.findOne(id);
  }

  @Mutation(() => MarketplacePost)
  updateMarketplacePost(
    @Args('updateMarketplacePostInput')
    updateMarketplacePostInput: UpdateMarketplacePostInput,
  ) {
    return this.marketplacePostService.update(
      updateMarketplacePostInput.id,
      updateMarketplacePostInput,
    );
  }

  @Mutation(() => MarketplacePost)
  removeMarketplacePost(@Args('id', { type: () => String }) id: string) {
    return this.marketplacePostService.remove(id);
  }
}
