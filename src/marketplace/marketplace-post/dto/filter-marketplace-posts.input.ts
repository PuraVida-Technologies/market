import { InputType, Field } from '@nestjs/graphql';
import {
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { GetAllDto } from '../../../common/inputs/get-all.input';

@InputType()
export class FilterMarketplacePostsInput extends GetAllDto {
  @Field(() => String, { description: 'This is the category id' })
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @Field(() => Number, { description: 'This is the longitude', nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsLongitude()
  longitude?: number;

  @Field(() => Number, { description: 'This is the latitude', nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsLatitude()
  latitude?: number;

  @Field(() => Number, {
    description: 'This is the max distance will search in',
    defaultValue: 5000,
    nullable: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  maxDistance?: number = 5000;

  @Field(() => Number, {
    description: 'This is the min distance will search in',
    defaultValue: 0,
    nullable: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minDistance?: number = 0;
}
