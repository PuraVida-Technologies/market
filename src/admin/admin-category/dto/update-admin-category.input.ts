import { CreateAdminCategoryInput } from './create-admin-category.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAdminCategoryInput extends PartialType(CreateAdminCategoryInput) {
  @Field(() => Int)
  id: number;
}
