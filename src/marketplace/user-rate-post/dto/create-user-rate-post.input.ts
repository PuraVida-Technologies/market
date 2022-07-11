import { InputType, Field } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateUserRatingPostInput {
  @Field(() => String, { description: 'This is user id' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Field(() => String, { description: 'This is post id' })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  postId: string;

  @Field(() => Number, { description: 'This is rate value' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  value: number;

  @Field(() => String, {
    description: 'This is the rate description',
    nullable: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(5)
  description?: string;
}
