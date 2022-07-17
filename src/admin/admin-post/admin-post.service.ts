import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, Post } from '../../models';
import { ApproveOrDeclinePostInput } from './dto/approve-or-decline-post.input';
import { GetAllAdminPostsInput } from './dto/find-admin-posts.input';
import * as _ from 'lodash';

@Injectable()
export class AdminPostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async approveOrDecline(approveOrDeclinePostInput: ApproveOrDeclinePostInput) {
    const { status, postId } = approveOrDeclinePostInput;

    const post = await this.postModel.findOneAndUpdate(
      { isDeleted: false, _id: postId },
      { $set: { status } },
      { new: true, lean: true },
    );

    if (!post) {
      throw new NotFoundException('This post is not exists');
    }

    return post;
  }

  findAll(getAdminPostInput: GetAllAdminPostsInput) {
    const { limit, order, page, sortBy, recentlyUpdatePeriod } =
      getAdminPostInput;

    const where: any = {
      isDeleted: false,
    };

    if (!_.isNil(recentlyUpdatePeriod)) {
      recentlyUpdatePeriod.endDate.setDate(
        recentlyUpdatePeriod.endDate.getDate() + 1,
      );
      recentlyUpdatePeriod.endDate.setHours(0, 0, 0, 0);

      where.updatedAt = {
        $gte: recentlyUpdatePeriod.startDate,
        $lt: recentlyUpdatePeriod.endDate,
      };
    }

    return this.postModel
      .find(where)
      .sort({ [sortBy]: order })
      .skip(page * limit - limit)
      .limit(limit)
      .lean();
  }

  async findOne(id: string) {
    const post = await this.postModel
      .findOne({ isDeleted: false, _id: id })
      .lean();

    if (!post) {
      throw new NotFoundException('This post is not exists');
    }

    return post;
  }

  async remove(id: string) {
    const deletedPost = await this.postModel.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: true } },
      { new: true, lean: true },
    );

    if (!deletedPost) {
      throw new NotFoundException('This post is not exists');
    }

    return deletedPost;
  }
}
