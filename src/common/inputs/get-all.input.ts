import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum Order {
  asc = 'asc',
  desc = 'desc',
  ascending = 'ascending',
  descending = 'descending',
}

@InputType()
export class GetAllDto {
  @Field(() => Number, {
    description: 'This is the page number',
    defaultValue: 1,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @Field(() => Number, {
    description: 'This is limit number',
    defaultValue: 10,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @Field(() => String, {
    description: 'This is the field sort by it',
    defaultValue: 'createdAt',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @Field(() => String, {
    description: 'This is the field sort by it',
    defaultValue: 'asc',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(Order)
  @IsString()
  order?: any = 'asc';
}
