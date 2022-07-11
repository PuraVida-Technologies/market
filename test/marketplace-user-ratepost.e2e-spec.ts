import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { setupTestApp } from './resources/app-test.module';
import { closeInMongodConnection } from './mongo.connection';

import { Category, Post, UserRatePost } from '../src/models';
import {
  generateCategory,
  generatePost,
  generateUserPostRate,
} from './resources';

describe('Marketplace User Rate Post resolvers (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let postModel: Model<Post>;
  let categoryModel: Model<Category>;
  let userRatePostModel: Model<UserRatePost>;

  beforeAll(async () => {
    ({ app, moduleFixture } = await setupTestApp());
    postModel = moduleFixture.get<Model<Post>>(getModelToken(Post.name));
    categoryModel = moduleFixture.get<Model<Category>>(
      getModelToken(Category.name),
    );

    userRatePostModel = moduleFixture.get<Model<UserRatePost>>(
      getModelToken(UserRatePost.name),
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

  describe('Create User Rate Post', () => {
    afterEach(async () => {
      await postModel.deleteMany({});
    });

    it('Should create user rate post successfully', async () => {
      const category = await categoryModel.findOne({}).lean();
      const post = await postModel.create({
        ...generatePost(),
        category,
        categoryId: category._id,
      });

      const createUserRatePost = `
      mutation {
        createUserRatingPost(createUserRatingPostInput:{
          description: "This is Test description"
          postId: "${post._id.toString()}" 
          userId: "${post._id.toString()}" 
          value: 1.5        
      }){
         _id
         userId
         value
         createdAt
         updatedAt
        }
      }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createUserRatePost });

      expect(body.errors).toBeUndefined();

      const { value } = body.data.createUserRatingPost;
      expect(value).toBe(1.5);
    });

    it('Should fail to create user rate post, bad request', async () => {
      const category = await categoryModel.findOne({}).lean();
      const post = await postModel.create({
        ...generatePost(),
        category,
        categoryId: category._id,
      });

      const createUserRatePost = `
      mutation {
        createUserRatingPost(createUserRatingPostInput:{
          description: "This is Test description"
          postId: "${post._id.toString()}"           
          value: "1.5"        
      }){
         _id
         userId
         value
         createdAt
         updatedAt
        }
      }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createUserRatePost });

      const { errors } = body;

      expect(errors).toBeDefined();

      expect(errors[0].message).not.toBeNull();
    });

    it('Should fail to create user rate post, post not exists', async () => {
      const category = await categoryModel.findOne({}).lean();

      const createUserRatePost = `
      mutation {
        createUserRatingPost(createUserRatingPostInput:{
          description: "This is Test description"
          postId: "${category._id.toString()}" 
          userId: "${category._id.toString()}" 
          value: 1.5        
      }){
         _id
         userId
         value
         createdAt
         updatedAt
        }
      }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createUserRatePost });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });
  });

  describe('Remove User Rate Post', () => {
    afterEach(async () => {
      await postModel.deleteMany({});
    });

    it('Should delete user rate post successfully', async () => {
      const category = await categoryModel.findOne({}).lean();
      const post = await postModel.create({
        ...generatePost(),
        category,
        categoryId: category._id,
      });

      const userRatePost = await userRatePostModel.create({
        ...generateUserPostRate(),
        postId: post._id,
      });

      const createUserRatePost = `
      mutation {
        removeUserRatingPost(id: "${userRatePost._id.toString()}"){
          _id
          userId
          value
          createdAt
          updatedAt
        }
      }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createUserRatePost });
      expect(body.errors).toBeUndefined();

      const { _id } = body.data.removeUserRatingPost;

      const deletedUserRatePost = await userRatePostModel.findById(_id);
      expect(deletedUserRatePost.isDeleted).toBe(true);
    });

    it('Should fail to delete user rate post, rate not exists', async () => {
      const category = await categoryModel.findOne({}).lean();
      const post = await postModel.create({
        ...generatePost(),
        category,
        categoryId: category._id,
      });

      const removeUserRatePost = `
      mutation {
        removeUserRatingPost(id: "${post._id.toString()}"}){
         _id
         userId
         value
         createdAt
         updatedAt
        }
      }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: removeUserRatePost });

      const { errors } = body;

      expect(errors).toBeDefined();

      expect(errors[0].message).not.toBeNull();
    });
  });
});
