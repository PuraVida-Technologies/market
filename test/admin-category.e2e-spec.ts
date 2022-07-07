import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { setupTestApp } from '../test/resources/app-test.module';
import { closeInMongodConnection } from './mongo.connection';

import { Category } from '../src/models';

describe('Admin Category resolvers (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let categoryModel: Model<Category>;

  beforeAll(async () => {
    ({ app, moduleFixture } = await setupTestApp());
    categoryModel = moduleFixture.get<Model<Category>>(
      getModelToken(Category.name),
    );

    await app.init();
  });

  afterAll(async () => {
    await categoryModel.deleteMany({});
    await closeInMongodConnection();
    await app.close();
  });

  describe('Add Category', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    it('Should add category successfully', async () => {
      const createAdminCategory = `
      mutation {
        createAdminCategory(createAdminCategoryInput:{
          name: "test"
      }){
        _id
        name
        createdAt
        updatedAt
      }
      }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createAdminCategory });

      const { name } = body.data.createAdminCategory;

      expect(body.errors).toBeUndefined();
      expect(name).toBe('test');
    });

    it('Should fail to add category, the category already exists', async () => {
      await categoryModel.create({ name: 'testing' });

      const createAdminCategory = `
      mutation {
        createAdminCategory(createAdminCategoryInput:{
          name: "testing"
      }){
        _id
        name
        createdAt
        updatedAt
      }
      }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createAdminCategory });
      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });

    it('Should fail to add category, bad request', async () => {
      const createAdminCategory = `
      mutation {
        createAdminCategory(createAdminCategoryInput:{}) {
          _id
          name
          createdAt
          updatedAt
        }
      }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: createAdminCategory });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).toBe(
        'Field "CreateAdminCategoryInput.name" of required type "String!" was not provided.',
      );
    });
  });
});
