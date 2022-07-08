import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { StatusCodes } from 'error-handler-e2';

import { setupTestApp } from '../test/resources/app-test.module';
import { closeInMongodConnection } from './mongo.connection';

import { Category, Post } from '../src/models';
import { generateCategory, generatePost } from './resources';

describe('Marketplace Post resolvers (e2e)', () => {
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

  describe('Create Post', () => {
    afterEach(async () => {
      await postModel.deleteMany({});
    });

    it('Should create post successfully', async () => {
      const category = await categoryModel.findOne({}).lean();

      const createMarketplacePost = `
      mutation {
        createMarketplacePost(createMarketplacePostInput:{
          address: "This is Test Address"
          categoryId: "${category._id.toString()}"
          description: "This is test description"
          email: "test@gmail.com"
          imagesUrls:["https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?s=612x612"]
          latitude: 31
          longitude: 31
          mainImageUrl: "https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?s=612x612"
          name: "Testing"
          openHours: "9 am: 8 pm"
          phoneNumber: "+201282190854"
          price: 1000
          userId: "5790fed5901f9061108a7c92"
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
            }
        }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createMarketplacePost });

      expect(body.errors).toBeUndefined();
      const { _id, name, address, categoryId } =
        body.data.createMarketplacePost;

      const samePost = await postModel.findOne({
        isDeleted: false,
        _id,
      });

      expect(samePost).not.toBeNull();
      expect(samePost.name).toEqual(name);
      expect(samePost.address).toEqual(address);
      expect(samePost.categoryId.toString()).toEqual(categoryId);

      expect(
        _.pick(samePost.category, [
          '_id',
          'name',
          'createdAt',
          'updatedAt',
          'isDeleted',
        ]),
      ).toEqual(
        _.pick(category, [
          '_id',
          'name',
          'createdAt',
          'updatedAt',
          'isDeleted',
        ]),
      );
    });

    it('Should fail to create post, bad request', async () => {
      const createMarketplacePost = `
      mutation {
        createMarketplacePost(createMarketplacePostInput:{
          address: "This is Test Address"
          categoryId: "sdklfklsdfjkldfsj"
          description: "This is test description"
          email: "test@gmail.com"
          imagesUrls:["https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?s=612x612"]
          latitude: 31
          longitude: 31
          mainImageUrl: "https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?s=612x612"
          name: "Testing"
          openHours: "9 am: 8 pm"
          phoneNumber: "+201282190854"
          price: 1000
          userId: "5790fed5901f9061108a7c92"
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
            }
        }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createMarketplacePost });

      expect(body.errors).toBeDefined();
      const { errors } = body;
      expect(errors[0].message).toBe('Bad Request Exception');
    });

    it('Should fail to create post, category is not exists', async () => {
      const category = await categoryModel.findOne({}).lean();

      await categoryModel.findOneAndUpdate(
        { _id: category._id },
        { $set: { isDeleted: true } },
      );

      const createMarketplacePost = `
      mutation {
        createMarketplacePost(createMarketplacePostInput:{
          address: "This is Test Address"
          categoryId: "${category._id.toString()}"
          description: "This is test description"
          email: "test@gmail.com"
          imagesUrls:["https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?s=612x612"]
          latitude: 31
          longitude: 31
          mainImageUrl: "https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?s=612x612"
          name: "Testing"
          openHours: "9 am: 8 pm"
          phoneNumber: "+201282190854"
          price: 1000
          userId: "5790fed5901f9061108a7c92"
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
            }
        }`;

      const { body, statusCode } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createMarketplacePost });
      const { errors } = body;
      expect(errors).toBeDefined();
      expect(statusCode).toEqual(StatusCodes.OK);
      expect(errors[0].message).toBe('the category does not exists');
      expect(+errors[0].extensions.code).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('Delete Post', () => {
    afterEach(async () => {
      await postModel.deleteMany({});
    });

    it('Should delete post successfully', async () => {
      const category = await categoryModel.findOne({}).lean();

      const post = await postModel.create({
        ...generatePost(),
        categoryId: category._id,
        category,
      });

      const deleteMarketplacePost = `
      mutation {
        removeMarketplacePost(id: "${post._id}"){
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
          }
        }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: deleteMarketplacePost });

      expect(body.errors).toBeUndefined();

      const deletePost = await postModel.findById(post._id);

      expect(deletePost.isDeleted).toBe(true);
    });

    it('Should fail to delete post, post not exists', async () => {
      const category = await categoryModel.findOne({}).lean();

      const deleteMarketplacePost = `
      mutation {
        removeMarketplacePost(id: "${category._id}"){
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
          }
        }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: deleteMarketplacePost });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });
  });
});
