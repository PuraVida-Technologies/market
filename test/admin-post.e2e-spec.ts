import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import * as faker from 'faker';

import { POST_STATUS } from '../src/common/constants';
import { setupTestApp } from '../test/resources/app-test.module';
import { closeInMongodConnection } from './mongo.connection';

import { Category, Post } from '../src/models';
import { generateCategory } from './resources';
import { generatePost } from './resources/post';

describe('Admin Post resolvers (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let postModel: Model<Post>;
  let categoryModel: Model<Category>;

  beforeAll(async () => {
    ({ app, moduleFixture } = await setupTestApp());
    postModel = moduleFixture.get<Model<Post>>(getModelToken(Post.name));
    categoryModel = moduleFixture.get<Model<Category>>(
      getModelToken(Category.name),
    );
    const category = generateCategory();

    await categoryModel.create(category);

    await app.init();
  });

  afterAll(async () => {
    await categoryModel.deleteMany({});
    await closeInMongodConnection();
    await app.close();
  });

  describe('Approve Or Decline Post', () => {
    beforeEach(async () => {
      const category = await categoryModel.findOne({});
      const post = generatePost();
      await postModel.create({ ...post, category, categoryId: category._id });
    });

    afterEach(async () => {
      await postModel.deleteMany({});
    });

    const approveOrDeclineAdminPost = `
    mutation ApproveOrDeclinePost($approveOrDeclinePostInput: ApproveOrDeclinePostInput!) {
      approveOrDeclinePost(approveOrDeclinePostInput: $approveOrDeclinePostInput) {
        _id
        name
        status
      }
    }`;

    it('Should Approve post successfully', async () => {
      const post = await postModel.findOne({}).lean();

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: approveOrDeclineAdminPost,
          variables: {
            approveOrDeclinePostInput: {
              postId: post._id.toHexString(),
              status: POST_STATUS.APPROVED
            }
          }
        });

      const { status } = body.data.approveOrDeclinePost;

      expect(body.errors).toBeUndefined();
      expect(status).toBe(POST_STATUS.APPROVED);
    });

    it('Should Decline post successfully', async () => {
      const post = await postModel.findOne({}).lean();

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: approveOrDeclineAdminPost,
          variables: {
            approveOrDeclinePostInput: {
              postId: post._id.toHexString(),
              status: POST_STATUS.DECLINED
            }
          }
        });

      const { status } = body.data.approveOrDeclinePost;

      expect(body.errors).toBeUndefined();
      expect(status).toBe(POST_STATUS.DECLINED);
    });

    it('Should fail to change post status, bad request', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: approveOrDeclineAdminPost,
          variables: {
            approveOrDeclinePostInput: {
              status: POST_STATUS.DECLINED
            }
          }
        });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).toBeDefined();
    });

    it('Should fail to change post status, the post not exists', async () => {
      const post = await postModel.findOne({}).lean();

      await postModel.updateOne(
        { _id: post._id },
        { $set: { isDeleted: true } },
        { lean: true },
      );

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: approveOrDeclineAdminPost,
          variables: {
            approveOrDeclinePostInput: {
              postId: new ObjectId().toHexString(),
              status: POST_STATUS.DECLINED
            }
          }
        });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).toBe('This post is not exists');
    });
  });

  describe('Delete Post', () => {
    let category: Category;
    beforeEach(async () => {
      category = await categoryModel.findOne({});
    });

    afterEach(async () => {
      await postModel.deleteMany({});
    });

    it('Should delete post successfully', async () => {
      const post = await postModel.create({
        ...generatePost(),
        category,
        categoryId: category._id,
      });

      const deleteAdminPost = `
      mutation {
        removeAdminPost(id: "${post._id}"){
          _id
          address
          categoryId
          description
          imagesUrls
          mainImageUrl
          name
          openHours
          price
          userId
          status
         }
        }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: deleteAdminPost });

      const { _id } = body.data.removeAdminPost;
      expect(body.errors).toBeUndefined();
      expect(_id.toString()).toBe(post._id.toString());

      const deletedPost = await postModel.findById(_id);
      expect(deletedPost.isDeleted).toBe(true);
    });

    it('Should fail to post, post not exists', async () => {
      const deleteAdminPost = `
      mutation {
        removeAdminPost(id: "${category._id}"){
          _id
          address
          categoryId
          description
          imagesUrls
          mainImageUrl
          name
          openHours
          price
          userId
          status
         }
        }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: deleteAdminPost });

      const { errors } = body;
      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });
  });

  describe('Get One Post', () => {
    let category: Category;
    beforeEach(async () => {
      category = await categoryModel.findOne({});
    });

    afterEach(async () => {
      await postModel.deleteMany({});
    });

    const getAdminPost = `
    query GetAdminPost($getAdminPostId: String!) {
      getAdminPost(id: $getAdminPostId) {
        _id
        address
        categoryId
        createdAt
        description
        imagesUrls
        mainImageUrl
        name
        openHours
        price
        status
        updatedAt
        userId
      }
    }
    `;

    it('Should get one post successfully', async () => {
      const post = await postModel.create({
        ...generatePost(),
        category,
        categoryId: category._id,
      });

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getAdminPost,
          variables: {
            getAdminPostId: post._id,
          },
        });

      expect(body.errors).toBeUndefined();
      const { _id } = body.data.getAdminPost;

      expect(_id.toString()).toBe(post._id.toString());
    });

    it('Should fail to get one post, post not exists', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getAdminPost,
          variables: {
            getAdminPostId: new ObjectId().toHexString(),
          },
        });
      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });
  });

  describe('Get Posts', () => {
    afterEach(async () => {
      await postModel.deleteMany({});
    });

    const getAdminPosts = `
    query GetAdminPosts($getAdminPostsInput: GetAllAdminPostsInput!) {
      getAdminPosts(getAdminPostsInput: $getAdminPostsInput) {
        _id
        address
        categoryId
        createdAt
        description
        imagesUrls
        mainImageUrl
        name
        openHours
        price
        status
        updatedAt
        userId
      }
    }
    `;

    it('Should get 10 posts successfully', async () => {
      const category = await categoryModel.findOne({}).lean();

      const posts = [];

      for (let index = 0; index < 15; index++) {
        posts.push({ ...generatePost(), categoryId: category._id, category });
      }

      await postModel.insertMany(posts);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getAdminPosts,
          variables: {
            getAdminPostsInput: {
              limit: 10,
            },
          },
        });

      const { getAdminPosts: postsData } = body.data;

      expect(body.errors).toBeUndefined();
      expect(postsData.length).toBe(10);
    });

    it('Should get posts between 2022-07-01 up to 2022-07-15, successfully, will get 5 posts', async () => {
      const category = await categoryModel.findOne({}).lean();

      const posts = [];

      for (let index = 0; index < 10; index++) {
        posts.push({
          ...generatePost(),
          categoryId: category._id,
          category,
        });
      }

      for (let index = 0; index < 5; index++) {
        posts.push({
          ...generatePost(),
          updatedAt: faker.date.between('2022-07-01', '2022-07-15'),
          categoryId: category._id,
          category,
        });
      }

      await postModel.insertMany(posts);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getAdminPosts,
          variables: {
            getAdminPostsInput: {
              recentlyUpdatePeriod: {
                startDate: '2022-07-01',
                endDate: '2022-07-15',
              },
            },
          },
        });

      const { getAdminPosts: postsData } = body.data;

      expect(body.errors).toBeUndefined();
      expect(postsData.length).toBe(5);
    });

    it('Should get posts between 2022-07-20 up to 2022-07-25, successfully, will get 0 posts', async () => {
      const category = await categoryModel.findOne({}).lean();

      const posts = [];

      for (let index = 0; index < 10; index++) {
        posts.push({
          ...generatePost(),
          updatedAt: faker.date.between('2022-06-01', '2022-06-15'),
          categoryId: category._id,
          category,
        });
      }

      for (let index = 0; index < 5; index++) {
        posts.push({
          ...generatePost(),
          updatedAt: faker.date.between('2022-07-01', '2022-07-15'),
          categoryId: category._id,
          category,
        });
      }

      await postModel.insertMany(posts);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getAdminPosts,
          variables: {
            getAdminPostsInput: {
              recentlyUpdatePeriod: {
                startDate: '2022-07-20',
                endDate: '2022-07-25',
              },
            },
          },
        });

      const { getAdminPosts: postsData } = body.data;

      expect(body.errors).toBeUndefined();
      expect(postsData.length).toBe(0);
    });

    it('Should fail to get posts, bad request', async () => {
      const category = await categoryModel.findOne({}).lean();

      const posts = [];

      for (let index = 0; index < 15; index++) {
        posts.push({ ...generatePost(), categoryId: category._id, category });
      }

      await postModel.insertMany(posts);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getAdminPosts,
          variables: {
            sortBy: 1,
          },
        });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });
  });
});
