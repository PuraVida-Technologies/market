import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class AutoCompleteCategoryInput {
  @Field(() => String, { description: 'This is the category name or prefix' })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  name: string;
}
