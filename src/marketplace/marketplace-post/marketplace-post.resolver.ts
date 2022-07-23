import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MarketplacePostService } from './marketplace-post.service';
import { MarketplacePost } from './entities/marketplace-post.entity';
import { CreateMarketplacePostInput } from './dto/create-marketplace-post.input';
import { UpdateMarketplacePostInput } from './dto/update-marketplace-post.input';
import { GetAllDto } from '../../common/inputs/get-all.input';
import { FilterMarketplacePostsInput } from './dto/filter-marketplace-posts.input';

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

  @Query(() => [MarketplacePost], { nullable: true })
  getMarketplacePosts(
    @Args('getMarketplacePostsInput')
    getMarketplacePostsInput?: GetAllDto,
  ) {
    return this.marketplacePostService.findAll(getMarketplacePostsInput);
  }

  @Query(() => MarketplacePost, { name: 'getMarketPlacePost' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.marketplacePostService.findOne(id);
  }

  @Mutation(() => MarketplacePost)
  updateMarketplacePost(
    @Args('updateMarketplacePostInput')
    updateMarketplacePostInput: UpdateMarketplacePostInput,
  ) {
    return this.marketplacePostService.update(updateMarketplacePostInput);
  }

  @Mutation(() => MarketplacePost)
  removeMarketplacePost(@Args('id', { type: () => String }) id: string) {
    return this.marketplacePostService.remove(id);
  }

  @Query(() => [MarketplacePost], { name: 'filterMarketplacePosts' })
  filerPosts(
    @Args('filterPostsInput') filterPostsInput: FilterMarketplacePostsInput,
  ) {
    return this.marketplacePostService.filterPosts(filterPostsInput);
  }
}
