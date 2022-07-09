import { CreateAdminCategoryInput } from './create-admin-category.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class UpdateAdminCategoryInput extends PartialType(
  CreateAdminCategoryInput,
) {
  @Field(() => String, {
    description: 'This is the name of category',
    nullable: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(1)
  name?: string;
}
