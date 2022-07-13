import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetAllDto } from '../../common/inputs/get-all.input';
import { Category, Post } from '../../models';
import { ApproveOrDeclinePostInput } from './dto/approve-or-decline-post.input';

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

  findAll(getAdminPostInput: GetAllDto) {
    const { limit, order, page, sortBy } = getAdminPostInput;
    return this.postModel
      .find({ isDeleted: false })
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
