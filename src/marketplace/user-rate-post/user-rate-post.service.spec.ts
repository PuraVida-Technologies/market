import { NotFoundException } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'bson';
import { Model } from 'mongoose';
import {
  Category,
  CategorySchema,
  Post,
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
  generateUserPostRate,
} from '../../../test/resources';
import { UserRatePostService } from './user-rate-post.service';

describe('UserRatePostService', () => {
  let service: UserRatePostService;
  let categoryModel: Model<Category>;
  let postModel: Model<Post>;
  let postRateModel: Model<UserRatePost>;

  beforeEach(async () => {
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
      providers: [UserRatePostService],
    }).compile();

    service = module.get<UserRatePostService>(UserRatePostService);
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
    postModel = module.get<Model<Post>>(getModelToken(Post.name));
    postRateModel = module.get<Model<UserRatePost>>(
      getModelToken(UserRatePost.name),
    );
  });

  afterEach(async () => {
    await Promise.all([
      () => categoryModel.deleteMany({}),
      () => postModel.deleteMany({}),
      () => postRateModel.deleteMany({}),
    ]);
    await closeInMongodConnection();
  });

  describe('create', () => {
    it('Should add a post rating successfully', async () => {
      const category = generateCategory();
      await categoryModel.create(category);

      const post = {
        ...generatePost(),
        categoryId: category._id,
      };
      await postModel.create(post);
      const postRate = {
        ...generateUserPostRate(),
        postId: post._id,
        categoryId: category._id,
      };

      const response = await service.create(postRate);
      expect(response).toBeDefined();
      expect(response.postId.toString()).toBe(post._id);
      expect(response.categoryId.toString()).toBe(category._id);
    });

    it('Should fail to add post rating if post does not exist', async () => {
      const postRate = generateUserPostRate();
      await expect(service.create(postRate)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('Should remove a post rating successfully', async () => {
      const category = generateCategory();
      await categoryModel.create(category);

      const post = {
        ...generatePost(),
        categoryId: category._id,
      };
      await postModel.create(post);
      const postRate = {
        ...generateUserPostRate(),
        postId: post._id,
        categoryId: category._id,
      };

      await postRateModel.create(postRate);

      const response = await service.remove(postRate._id);
      expect(response).toBeDefined();
      expect(response.isDeleted).toBe(true);
    });

    it('Should fail to remove post rating if not exist', async () => {
      await expect(
        service.remove(new ObjectId().toHexString()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
