import { NotFoundException } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';
import {
  Category,
  CategorySchema,
  Post,
  PostRepository,
  PostSchema,
  UserRatePost,
  UserRatePostSchema,
} from '../../models';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/mongo.connection';
import {
  generateCategory,
  generatePost,
  generatePostInput,
} from '../../../test/resources';
import { MarketplacePostService } from './marketplace-post.service';
import { POST_STATUS } from '../../common/constants';

describe('MarketplacePostService', () => {
  let service: MarketplacePostService;
  let categoryModel: Model<Category>;
  let postModel: Model<Post>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Category.name,
            schema: CategorySchema,
          },
          {
            name: Post.name,
            schema: PostSchema,
          },
          {
            name: UserRatePost.name,
            schema: UserRatePostSchema,
          },
        ]),
      ],
      providers: [MarketplacePostService, PostRepository],
    }).compile();

    service = module.get<MarketplacePostService>(MarketplacePostService);
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
    postModel = module.get<Model<Post>>(getModelToken(Post.name));
  });

  afterAll(async () => {
    await Promise.all([
      () => categoryModel.deleteMany({}),
      () => postModel.deleteMany({}),
    ]);
    await closeInMongodConnection();
  });

  describe('create', () => {
    afterEach(async () => {
      await postModel.deleteMany({});
    });

    it('Should create post successfully', async () => {
      const category = generateCategory();
      await categoryModel.create(category);

      const post = generatePostInput(category._id);
      await expect(service.create(post)).resolves.toBeDefined();
    });

    it('Should fail to create post, category is not exists', async () => {
      const post = generatePostInput(new ObjectId().toHexString());
      await expect(service.create(post)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    afterEach(async () => {
      await postModel.deleteMany({});
    });

    it('Should return less than or equal to 10 post, all should be approved', async () => {
      const category = generateCategory();
      await categoryModel.create(category);

      const posts = [];
      const num = 20;
      const approvedCount = 15;

      for (let index = 0; index < num; index++) {
        if (index < approvedCount) {
          posts.push({
            ...generatePost(),
            categoryId: category._id,
            status: POST_STATUS.APPROVED,
          });
        } else {
          posts.push({
            ...generatePost(),
            categoryId: category._id,
            status: POST_STATUS.PENDING,
          });
        }
      }
      await postModel.insertMany(posts);

      const response = await service.findAll({});

      // Check the posts length should be less than or equal to approvedCount
      expect(response.length).toBeLessThanOrEqual(approvedCount);

      // Check all the posts should not be deleted
      expect(
        response.every(
          (p) => p.isDeleted === false && p.status === POST_STATUS.APPROVED,
        ),
      ).toBeTruthy();
    });
  });

  describe('findOne', () => {
    afterEach(async () => {
      await postModel.deleteMany({});
    });

    it('Should return 1 post which is not deleted', async () => {
      const category = generateCategory();
      await categoryModel.create(category);

      const post = {
        ...generatePost(),
        categoryId: category._id,
      };
      await postModel.create(post);

      const response = await service.findOne(post._id);
      expect(response).toBeDefined();
      expect(response._id.toString()).toBe(post._id);
    });

    it('Should fail to return post if deleted', async () => {
      const category = generateCategory();
      await categoryModel.create(category);

      const post = {
        ...generatePost(),
        categoryId: category._id,
        isDeleted: true,
      };
      await postModel.create(post);

      await expect(service.findOne(post._id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Should fail to return post if not exist', async () => {
      await expect(
        service.findOne(new ObjectId().toHexString()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    afterEach(async () => {
      await postModel.deleteMany({});
    });

    it('Should update post successfully', async () => {
      const category = generateCategory();
      await categoryModel.create(category);

      const post = {
        ...generatePost(),
        categoryId: category._id,
      };
      await postModel.create(post);

      const name = 'test';
      const response = await service.update({
        postId: post._id,
        categoryId: category._id,
        name,
      });
      expect(response).toBeDefined();
      expect(response.name).toBe(name);
    });

    it('Should fail to update post, post not exists', async () => {
      const category = generateCategory();
      await categoryModel.create(category);

      await expect(
        service.update({
          postId: new ObjectId().toHexString(),
          categoryId: category._id,
          name: 'test',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('Should fail to update post, category not exists', async () => {
      const category = generateCategory();
      await categoryModel.create(category);

      const post = {
        ...generatePost(),
        categoryId: category._id,
      };
      await postModel.create(post);

      await expect(
        service.update({
          postId: post._id,
          categoryId: new ObjectId().toHexString(),
          name: 'test',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // TODO: Test cases for "filterPosts"
});
