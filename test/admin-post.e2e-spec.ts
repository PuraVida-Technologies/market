import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

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

    it('Should Approve post successfully', async () => {
      const post = await postModel.findOne({}).lean();

      const createMarketplacePost = `
      mutation {
        approveOrDeclinePost(approveOrDeclinePostInput:{
          postId: "${post._id.toString()}"          
          status: "${POST_STATUS.APPROVED}"
      }){
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
        .send({ query: createMarketplacePost });

      const { status } = body.data.approveOrDeclinePost;

      expect(body.errors).toBeUndefined();
      expect(status).toBe(POST_STATUS.APPROVED);
    });

    it('Should Decline post successfully', async () => {
      const post = await postModel.findOne({}).lean();

      const createMarketplacePost = `
      mutation {
        approveOrDeclinePost(approveOrDeclinePostInput:{
          postId: "${post._id.toString()}"          
          status: "${POST_STATUS.DECLINE}"
      }){
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
        .send({ query: createMarketplacePost });

      const { status } = body.data.approveOrDeclinePost;

      expect(body.errors).toBeUndefined();
      expect(status).toBe(POST_STATUS.DECLINE);
    });

    it('Should fail to change post status, bad request', async () => {
      const createMarketplacePost = `
      mutation {
        approveOrDeclinePost(approveOrDeclinePostInput:{          
          status: "${POST_STATUS.DECLINE}"
      }){
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
        .send({ query: createMarketplacePost });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).toBe(
        'Field "ApproveOrDeclinePostInput.postId" of required type "String!" was not provided.',
      );
    });

    it('Should fail to change post status, the post not exists', async () => {
      const post = await postModel.findOne({}).lean();

      await postModel.updateOne(
        { _id: post._id },
        { $set: { isDeleted: true } },
        { lean: true },
      );

      const createMarketplacePost = `
      mutation {
        approveOrDeclinePost(approveOrDeclinePostInput:{
          postId: "${post._id.toString()}"       
          status: "${POST_STATUS.DECLINE}"
      }){
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
        .send({ query: createMarketplacePost });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).toBe('This post is not exists');
    });
  });
});
