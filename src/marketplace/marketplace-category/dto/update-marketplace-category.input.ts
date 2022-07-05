import { CreateMarketplaceCategoryInput } from './create-marketplace-category.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMarketplaceCategoryInput extends PartialType(
  CreateMarketplaceCategoryInput,
) {
  @Field(() => Int)
  id: number;
}
