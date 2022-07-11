import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { setupTestApp } from './resources/app-test.module';
import { closeInMongodConnection } from './mongo.connection';

import { Category, Post } from '../src/models';
import { generateCategory, generatePost } from './resources';

describe('Marketplace User Rate Post resolvers (e2e)', () => {
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
});
