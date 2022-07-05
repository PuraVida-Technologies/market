import { InputType, Field } from '@nestjs/graphql';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { POST_STATUS } from '../../../common/constants';

@InputType()
export class ApproveOrDeclinePostInput {
  @Field(() => String, { description: 'This is the status of the Post' })
  @IsString()
  @Length(1)
  @IsEnum(POST_STATUS, {
    message: `status must be on these values: ${POST_STATUS.APPROVED}, ${POST_STATUS.DECLINE}, ${POST_STATUS.PENDING}`,
  })
  status: string;

  @Field(() => String, { description: 'This is the post id' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}
