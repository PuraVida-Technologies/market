import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';

import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../test/mongo.connection';
import { Category, CategorySchema, Post, PostSchema } from '../../models';
import { generateCategory, generatePost } from '../../../test/resources';
import { AdminPostService } from './admin-post.service';
import { NotFoundException } from '@nestjs/common';
import { POST_STATUS } from '../../common/constants';

describe('AdminPostService', () => {
  let service: AdminPostService;
  let categoryModel: Model<Category>;
  let postModel: Model<Post>;

  const cleanUpData = async () => {
    await Promise.all([
      () => categoryModel.deleteMany({}),
      () => postModel.deleteMany({}),
    ]);
  };

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
        ]),
      ],
      providers: [AdminPostService],
    }).compile();

    service = module.get<AdminPostService>(AdminPostService);
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
    postModel = module.get<Model<Post>>(getModelToken(Post.name));
  });

  afterAll(async () => {
    await cleanUpData();
    await closeInMongodConnection();
  });

  describe('approveOrDecline', () => {
    afterEach(cleanUpData);

    it('Should approve post successfully', async () => {
      const category = generateCategory();
      await categoryModel.insertMany([category]);

      const post = {
        ...generatePost(),
        categoryId: category._id,
      };
      await postModel.insertMany([post]);

      const response = await service.approveOrDecline({
        status: POST_STATUS.APPROVED,
        postId: post._id,
      });
      expect(response.status).toBe(POST_STATUS.APPROVED);
    });

    it('Should fail to approve the post if not exist', async () => {
      await expect(
        service.approveOrDecline({
          status: POST_STATUS.APPROVED,
          postId: new ObjectId().toHexString(),
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    afterEach(cleanUpData);

    it('Should return 10 posts', async () => {
      const category = generateCategory();
      await categoryModel.insertMany([category]);

      const num = 15;
      const limit = 10;
      const posts = [];
      for (let index = 0; index < num; index++) {
        posts.push({
          ...generatePost(),
          categoryId: category._id,
        });
      }
      await postModel.insertMany(posts);

      const response = await service.findAll({ limit });
      expect(response.length).toBeLessThanOrEqual(limit);
    });
  });

  describe('findOne', () => {
    afterEach(cleanUpData);

    it('Should get a single post', async () => {
      const category = generateCategory();
      await categoryModel.insertMany([category]);

      const post = {
        ...generatePost(),
        categoryId: category._id,
      };
      await postModel.insertMany([post]);

      const response = await service.findOne(post._id);
      expect(response._id.toHexString()).toBe(post._id);
    });

    it('Should fail to get post if not exist', async () => {
      expect(
        service.findOne(new ObjectId().toHexString()),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    afterEach(cleanUpData);

    it('Should remove a post', async () => {
      const category = generateCategory();
      await categoryModel.insertMany([category]);

      const post = {
        ...generatePost(),
        categoryId: category._id,
      };
      await postModel.insertMany([post]);

      const response = await service.remove(post._id);
      expect(response.isDeleted).toBe(true);
    });

    it('Should fail to remove post if not found', async () => {
      await expect(
        service.remove(new ObjectId().toHexString()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
