import { CreateMarketplacePostInput } from './create-marketplace-post.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

@InputType()
export class UpdateMarketplacePostInput extends PartialType(
  CreateMarketplacePostInput,
) {
  @Field(() => String, { description: 'This is the post id' })
  @IsNotEmpty()
  @IsMongoId()
  postId: string;

  @Field(() => String, {
    description: 'This is the name of the post',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1)
  name?: string;

  @Field(() => String, {
    description: 'This is the category id',
    nullable: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  categoryId?: string;

  @Field(() => String, {
    description: 'This is the description of the post',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1)
  description?: string;

  @Field(() => String, {
    description: 'This is the main image of the post',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  mainImageUrl?: string;

  @Field(() => [String], {
    description: 'This is the rest of images',
    nullable: true,
  })
  @IsOptional()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsUrl(
    { require_protocol: true, require_valid_protocol: true },
    { each: true },
  )
  imagesUrls?: string[];

  @Field(() => String, { description: 'This is the address', nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1)
  address?: string;

  @Field(() => Number, { description: 'This is the latitude', nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Number, { description: 'This is the longitude', nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field(() => String, {
    description: 'This is the Owner phone number',
    nullable: true,
  })
  @IsOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @Field(() => String, {
    description: 'This is the Owner email',
    nullable: true,
  })
  @IsOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;

  @Field(() => String, { description: 'This is the Owner Id', nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1)
  userId?: string;

  @Field(() => Number, { description: 'This is the price', nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price?: number;

  @Field(() => String, {
    description: 'This is the open hours',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  openHours?: string;
}
