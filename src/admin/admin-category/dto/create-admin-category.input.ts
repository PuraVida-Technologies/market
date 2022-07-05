import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateAdminCategoryInput {
  @Field(() => String, { description: 'This is the name of category' })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  name: string;
}
