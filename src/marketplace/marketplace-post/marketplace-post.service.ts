import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createPostFormat } from '../../common/helpers';
import { Category, Post } from '../../models';
import { CreateMarketplacePostInput } from './dto/create-marketplace-post.input';
import { UpdateMarketplacePostInput } from './dto/update-marketplace-post.input';
import { GetAllDto } from '../../common/inputs/get-all.input';
@Injectable()
export class MarketplacePostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  async create(createMarketplacePostInput: CreateMarketplacePostInput) {
    const { categoryId } = createMarketplacePostInput;

    const category: Category = await this.categoryModel
      .findOne({
        isDeleted: false,
        _id: categoryId,
      })
      .lean();

    if (!category) {
      throw new NotFoundException('the category does not exists');
    }

    const post = {
      ...createPostFormat(createMarketplacePostInput),
      category,
    };

    return this.postModel.create(post);
  }

  findAll(getMarketplacePostInput: GetAllDto) {
    const { limit, order, page, sortBy } = getMarketplacePostInput;

    return this.postModel
      .find({ isDeleted: false })
      .sort({ [sortBy]: order })
      .skip(page * limit - limit)
      .limit(limit)
      .lean();
  }

  findOne(id: number) {
    return `This action returns a #${id} marketplacePost`;
  }

  async update(updateMarketplacePostInput: UpdateMarketplacePostInput) {
    const { postId, categoryId } = updateMarketplacePostInput;

    const post = await this.getOneById(postId);

    if (!post) {
      throw new NotFoundException('This post not exists');
    }

    let category: Category;

    if (categoryId) {
      category = await this.getCategoryById(categoryId);

      if (!category) {
        throw new NotFoundException('This category not exists');
      }
    }

    const newPost = createPostFormat(updateMarketplacePostInput);

    return this.postModel.findOneAndUpdate(
      { isDeleted: false, _id: postId },
      { $set: { ...newPost, category: { ...category } } },
      { new: true, lean: true },
    );
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

  getOneById(id: string) {
    return this.postModel.findOne({ isDeleted: false, _id: id }).lean();
  }

  getCategoryById(id: string) {
    return this.categoryModel.findOne({ isDeleted: false, _id: id }).lean();
  }
}
