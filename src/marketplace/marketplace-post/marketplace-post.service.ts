import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as _ from 'lodash';

import { createPostFormat } from '../../common/helpers';
import { Category, Post, UserRatePost } from '../../models';
import { CreateMarketplacePostInput } from './dto/create-marketplace-post.input';
import { FilterMarketplacePostsInput } from './dto/filter-marketplace-posts.input';
import { UpdateMarketplacePostInput } from './dto/update-marketplace-post.input';
import { GetAllDto } from '../../common/inputs/get-all.input';
@Injectable()
export class MarketplacePostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(UserRatePost.name)
    private readonly userRatePostModel: Model<UserRatePost>,

    @InjectConnection() private readonly connection: mongoose.Connection,
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

  async filterPosts(filterPostsInput: FilterMarketplacePostsInput) {
    const {
      categoryId,
      order,
      sortBy,
      page,
      limit,
      longitude,
      latitude,
      maxDistance,
      minDistance,
    } = filterPostsInput;

    const query: any = { isDeleted: false, categoryId };

    if (longitude && latitude) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
          $minDistance: minDistance,
        },
      };
    }

    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const posts = await this.postModel
        .find(query, {}, { session })
        .sort({ [sortBy]: order })
        .skip(page * limit - limit)
        .limit(limit)
        .lean();

      const postsIds = posts.map((post) => post._id.toString());

      const postsRatings = await this.userRatePostModel
        .find(
          {
            isDeleted: false,
            postId: {
              $in: postsIds,
            },
          },
          {},
          { session },
        )
        .select({ postId: 1, value: 1 })
        .lean();

      const result = _.chain(postsRatings)
        .groupBy('postId')
        .map((group, key) => ({
          _id: key,
          rating: _.sumBy(group, 'value') / group.length,
        }))
        .value();

      const merged = _.merge(_.keyBy(posts, '_id'), _.keyBy(result, '_id'));

      return _.values(merged);
    } catch (error) {
      await session.abortTransaction();
      throw new UnprocessableEntityException(
        `can't filter right now, please try again later`,
      );
    } finally {
      session.endSession();
    }
  }
}
