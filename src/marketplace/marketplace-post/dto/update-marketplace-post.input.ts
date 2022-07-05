import { CreateMarketplacePostInput } from './create-marketplace-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMarketplacePostInput extends PartialType(
  CreateMarketplacePostInput,
) {
  @Field(() => Int)
  id: number;
}
