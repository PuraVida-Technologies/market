import { InputType, Field } from '@nestjs/graphql';
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
  @IsString({ each: true })
  @IsUrl(
    { require_protocol: true, require_valid_protocol: true },
    { each: true },
  )
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
  @IsEmail()
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

  @Field(() => String, { description: 'This is the open hours' })
  @IsString()
  @IsNotEmpty()
  openHours: string;
}
