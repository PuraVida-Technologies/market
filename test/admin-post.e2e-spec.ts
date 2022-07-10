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

      const approveOrDeclineAdminPost = `
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
        .send({ query: approveOrDeclineAdminPost });

      const { status } = body.data.approveOrDeclinePost;

      expect(body.errors).toBeUndefined();
      expect(status).toBe(POST_STATUS.APPROVED);
    });

    it('Should Decline post successfully', async () => {
      const post = await postModel.findOne({}).lean();

      const approveOrDeclineAdminPost = `
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
        .send({ query: approveOrDeclineAdminPost });

      const { status } = body.data.approveOrDeclinePost;

      expect(body.errors).toBeUndefined();
      expect(status).toBe(POST_STATUS.DECLINE);
    });

    it('Should fail to change post status, bad request', async () => {
      const approveOrDeclineAdminPost = `
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
        .send({ query: approveOrDeclineAdminPost });

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

      const approveOrDeclineAdminPost = `
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
        .send({ query: approveOrDeclineAdminPost });

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

    it('Should Approve post successfully', async () => {
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

    it('Should Approve post successfully', async () => {
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

    it('Should get one post successfully', async () => {
      const post = await postModel.create({
        ...generatePost(),
        category,
        categoryId: category._id,
      });

      const deleteAdminPost = `
      query {
        getOneAdminPost(id: "${post._id}"){
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

      expect(body.errors).toBeUndefined();
      const { _id } = body.data.getOneAdminPost;

      expect(_id.toString()).toBe(post._id.toString());
    });

    it('Should fail to get one post, post not exists', async () => {
      const deleteAdminPost = `
      query {
        getOneAdminPost(id: "${category._id}"){
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
});
