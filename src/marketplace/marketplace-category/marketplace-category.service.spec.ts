import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Category, CategorySchema } from '../../models';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/mongo.connection';
import { generateCategory } from '../../../test/resources';
import { MarketplaceCategoryService } from './marketplace-category.service';

describe('MarketplaceCategoryService', () => {
  let service: MarketplaceCategoryService;
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
      providers: [MarketplaceCategoryService],
    }).compile();

    service = module.get<MarketplaceCategoryService>(
      MarketplaceCategoryService,
    );
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
  });

  afterAll(async () => {
    await categoryModel.deleteMany({});
    await closeInMongodConnection();
  });

  // TODO: Add test cases for autoComplete

  describe('findAll', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    it('Should return all 10 categories which are active', async () => {
      const categories = [];
      const num = 15;
      const deletedCount = 10;

      for (let index = 0; index < num; index++) {
        if (index < deletedCount) {
          categories.push({
            ...generateCategory(),
            isDeleted: true,
          });
        } else {
          categories.push({ ...generateCategory() });
        }
      }
      await categoryModel.insertMany(categories);

      const catResponse = await service.findAll();
      expect(catResponse.length).toBe(num - deletedCount);
    });
  });

  describe('findOne', () => {
    afterEach(async () => {
      await categoryModel.deleteMany({});
    });

    it('Should return 1 category which are not deleted', async () => {
      const category = generateCategory();
      await categoryModel.insertMany([category]);

      const catResponse = await service.findOne(category._id);
      expect(catResponse._id.toHexString()).toBe(category._id);
    });

    it('Should fail to return category if deleted', async () => {
      const category = {
        ...generateCategory(),
        isDeleted: true,
      };
      await categoryModel.insertMany([category]);

      const catResponse = await service.findOne(category._id);
      expect(catResponse).toBeNull();
    });
  });
});
