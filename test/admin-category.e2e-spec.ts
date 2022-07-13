import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ObjectId } from 'bson';

import { setupTestApp } from '../test/resources/app-test.module';
import { closeInMongodConnection } from './mongo.connection';

import { Category } from '../src/models';
import { generateCategory } from './resources';

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

  describe('Delete Category', () => {
    const removeAdminCategory = `
    mutation RemoveAdminCategory($removeAdminCategoryId: String!) {
      removeAdminCategory(id: $removeAdminCategoryId) {
        _id
        createdAt
        name
        updatedAt
      }
    }
    `;

    it('Should delete category successfully', async () => {
      const category = await categoryModel.create(generateCategory());

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: removeAdminCategory,
          variables: {
            removeAdminCategoryId: category._id,
          },
        });

      expect(body.errors).toBeUndefined();

      const deletedCategory = await categoryModel.findById(category._id);
      expect(deletedCategory.isDeleted).toBe(true);
    });

    it('Should fail to delete category, category not exists', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: removeAdminCategory,
          variables: {
            removeAdminCategoryId: new ObjectId().toHexString(),
          },
        });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });

    it('Should fail to delete category, bad request', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: removeAdminCategory,
          variables: {},
        });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });
  });

  describe('Update Category', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    const updateAdminCategory = `
    mutation UpdateAdminCategory($updateAdminCategoryId: String!, $updateAdminCategoryInput: UpdateAdminCategoryInput!) {
      updateAdminCategory(id: $updateAdminCategoryId, updateAdminCategoryInput: $updateAdminCategoryInput) {
        _id
        createdAt
        name
        updatedAt
      }
    }
    `;

    it('Should update category successfully', async () => {
      const category = await categoryModel.create(generateCategory());

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: updateAdminCategory,
          variables: {
            updateAdminCategoryInput: {
              name: 'Updated Name',
            },
            updateAdminCategoryId: category._id,
          },
        });

      const { name } = body.data.updateAdminCategory;

      expect(body.errors).toBeUndefined();
      expect(name).toBe('Updated Name');
    });

    it('Should fail to update category, category not exists', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: updateAdminCategory,
          variables: {
            updateAdminCategoryInput: {
              name: 'update one',
            },
            updateAdminCategoryId: new ObjectId().toHexString(),
          },
        });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });
  });

  describe('Get Category', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    const getAdminCategories = `
    query GetAdminCategories($getAdminCategoriesInput: GetAllInput!) {
      getAdminCategories(getAdminCategoriesInput: $getAdminCategoriesInput) {
        _id
        createdAt
        name
        updatedAt
      }
    }
    `;

    it('Should get 10 categories successfully', async () => {
      const categories = [];

      for (let index = 0; index < 15; index++) {
        categories.push({ ...generateCategory() });
      }

      await categoryModel.insertMany(categories);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getAdminCategories,
          variables: {
            getAdminCategoriesInput: {
              limit: 10,
            },
          },
        });

      const { getAdminCategories: categoriesData } = body.data;

      expect(body.errors).toBeUndefined();
      expect(categoriesData.length).toBe(10);
    });

    it('Should fail to get categories, bad request', async () => {
      const categories = [];

      for (let index = 0; index < 15; index++) {
        categories.push({ ...generateCategory() });
      }

      await categoryModel.insertMany(categories);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getAdminCategories,
          variables: {
            getAdminCategoriesInput: {
              sortBy: 1,
            },
          },
        });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });
  });
});
