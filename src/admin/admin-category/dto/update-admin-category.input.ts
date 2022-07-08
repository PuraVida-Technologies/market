import { CreateAdminCategoryInput } from './create-admin-category.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class UpdateAdminCategoryInput extends PartialType(
  CreateAdminCategoryInput,
) {
  @Field(() => String, { description: 'This is the name of category' })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  name: string;
}
