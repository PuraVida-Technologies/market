import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRatingPostInput } from './dto/create-user-rate-post.input';
import { UserRatePost, Post } from '../../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRatePostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(UserRatePost.name)
    private readonly userRatePostModel: Model<UserRatePost>,
  ) {}

  async create(createUserRatePostInput: CreateUserRatingPostInput) {
    const { postId } = createUserRatePostInput;

    const post = await this.postModel
      .findOne({ isDeleted: false, _id: postId })
      .lean();

    if (!post) {
      throw new NotFoundException('This post is not exist');
    }

    return this.userRatePostModel.create({
      ...createUserRatePostInput,
      categoryId: post.categoryId,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} userRatePost`;
  }
}
