import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { GetAllDto } from '../../../common/inputs/get-all.input';

@InputType('DateFilterInput')
export class DateFilterDto {
  @Field(() => Date, { description: 'This is the start date for filter' })
  @IsDate()
  @IsNotEmpty()
  @Length(1)
  startDate: Date;

  @Field(() => Date, { description: 'This is the end date for filter' })
  @IsDate()
  @IsNotEmpty()
  @Length(1)
  endDate: Date;
}

@InputType()
export class GetAllAdminPostsInput extends GetAllDto {
  @Field(() => DateFilterDto, {
    description: 'This is the date filter',
    nullable: true,
  })
  @IsOptional()
  recentlyUpdatePeriod?: DateFilterDto;
}
