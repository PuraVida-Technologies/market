import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';

@InputType()
export class CreateMarketplacePostInput {
  @Field(() => String, { description: 'This is the name of the post' })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  name: string;

  @Field(() => String, { description: 'This is the category id' })
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @Field(() => String, { description: 'This is the description of the post' })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  description: string;

  @Field(() => String, { description: 'This is the main image of the post' })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  mainImageUrl: string;

  @Field(() => [String], { description: 'This is the rest of images' })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @IsString()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  imagesUrls: string[];

  @Field(() => String, { description: 'This is the address' })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  address: string;

  @Field(() => Number, { description: 'This is the latitude' })
  @IsNumber()
  latitude: number;

  @Field(() => Number, { description: 'This is the longitude' })
  @IsNumber()
  longitude: number;

  @Field(() => String, {
    description: 'This is the Owner phone number',
    nullable: true,
  })
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
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  email: string;

  @Field(() => String, { description: 'This is the Owner Id' })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  userId: string;

  @Field(() => Number, { description: 'This is the price' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @Field(() => Number, { description: 'This is the open hours' })
  @IsString()
  @IsNotEmpty()
  openHours: string;
}
