import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRatePostInput } from './dto/create-user-rate-post.input';
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

  async create(createUserRatePostInput: CreateUserRatePostInput) {
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

  async remove(id: string) {
    const deletesPostRate = await this.userRatePostModel.findOneAndUpdate(
      { isDeleted: false, _id: id },
      { $set: { isDeleted: true } },
      { new: true, lean: true },
    );

    if (!deletesPostRate) {
      throw new NotFoundException('This post rate is not exist');
    }

    return deletesPostRate;
  }
}
