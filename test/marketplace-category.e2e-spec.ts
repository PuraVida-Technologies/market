import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ObjectId } from 'bson';

import { setupTestApp } from './resources/app-test.module';
import { closeInMongodConnection } from './mongo.connection';

import { Category } from '../src/models';
import { generateCategory } from './resources';

describe('Marketplace Category resolvers (e2e)', () => {
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

  // TODO: Add test case for marketplaceAutoCompleteCategory

  describe('Get Categories', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    const getMarketplaceCategories = `
    query GetMarketplaceCategories {
      getMarketplaceCategories {
        _id
        createdAt
        name
        updatedAt
      }
    }
    `;

    it('Should get 10 categories successfully', async () => {
      const categories = [];
      const num = 15;
      const isDeletedCount = 5;
      for (let index = 0; index < num; index++) {
        if (index < isDeletedCount) {
          categories.push({
            ...generateCategory(),
            isDeleted: true,
          });
        } else {
          categories.push(generateCategory());
        }
      }

      await categoryModel.insertMany(categories);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: getMarketplaceCategories });

      const { getMarketplaceCategories: categoriesData } = body.data;

      expect(body.errors).toBeUndefined();
      expect(categoriesData.length).toBe(num - isDeletedCount);
    });
  });

  describe('Get One Category', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    const getMarketplaceCategory = `
    query GetMarketplaceCategory($getMarketplaceCategoryId: String!) {
      getMarketplaceCategory(id: $getMarketplaceCategoryId) {
        _id
        createdAt
        name
        updatedAt
      }
    }
    `;

    it('Should get 1 category successfully', async () => {
      const category = generateCategory();
      await categoryModel.insertMany([category]);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getMarketplaceCategory,
          variables: {
            getMarketplaceCategoryId: category._id,
          },
        });

      const { getMarketplaceCategory: categoryData } = body.data;

      expect(body.errors).toBeUndefined();
      expect(categoryData._id).toBe(category._id);
    });

    it('Should fail to get category, not found', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({
          query: getMarketplaceCategory,
          variables: {
            getMarketplaceCategoryId: new ObjectId().toHexString(),
          },
        });

      const { errors } = body;

      expect(errors).toBeDefined();
      expect(errors[0].message).not.toBeNull();
    });
  });
});
