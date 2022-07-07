import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateAdminCategoryInput {
  @Field(() => String, { description: 'This is the name of category' })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  name: string;
}
