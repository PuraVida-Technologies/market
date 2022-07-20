import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';

import { rootMongooseTestModule, closeInMongodConnection } from '../../../test/mongo.connection';
import { Category, CategorySchema } from '../../models';
import { generateCategory } from '../../../test/resources';
import { AdminCategoryService } from './admin-category.service';
import { NotFoundException } from '@nestjs/common';

describe('AdminCategoryService', () => {
  let service: AdminCategoryService;
  let categoryModel: Model<Category>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Category.name,
            schema: CategorySchema,
          },
        ]),
      ],
      providers: [AdminCategoryService],
    }).compile();

    service = module.get<AdminCategoryService>(AdminCategoryService);
    categoryModel = module.get<Model<Category>>(
      getModelToken(Category.name),
    );
  });

  afterAll(async () => {
    await categoryModel.deleteMany({});
    await closeInMongodConnection();
  });

  describe('create', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    it('Should create category successfully', async () => {
      const category = generateCategory();
      const catResponse = await service.create(category);
      expect(category.name).toBe(catResponse.name);
    });
  });

  describe('findAll', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    it('Should return 10 categories', async () => {
      const categories = [];
      const num = 15;
      const limit = 10;

      for (let index = 0; index < num; index++) {
        categories.push({ ...generateCategory() });
      }
      await categoryModel.insertMany(categories);

      const catResponse = await service.findAll({ limit });
      expect(catResponse.length).toBeLessThanOrEqual(limit);
    });
  });

  describe('findOne', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    it('Should get a single category', async () => {
      const category = generateCategory();
      await categoryModel.insertMany([category]);
      const catResponse = await service.findOne(category._id);
      expect(catResponse._id.toHexString()).toBe(category._id);
    });

    it('Should fail to get category', async () => {
      const catResponse = await service.findOne(new ObjectId().toHexString());
      expect(catResponse).toBeNull();
    })
  });

  describe('update', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    it('Should update a category', async () => {
      const category = generateCategory();
      await categoryModel.insertMany([category]);
      const catResponse = await service.update(category._id, { name: "test" });
      expect(catResponse.name).toBe("test");
    });

    it('Should fail to update category if not found', async () => {
      await expect(service.update(new ObjectId().toHexString(), { name: "test" })).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    it('Should remove a category', async () => {
      const category = generateCategory();
      await categoryModel.insertMany([category]);
      const catResponse = await service.remove(category._id);
      expect(catResponse.isDeleted).toBe(true);
    });

    it('Should fail to remove category if not found', async () => {
      await expect(service.remove(new ObjectId().toHexString())).rejects.toThrow(NotFoundException);
    });
  });
});
