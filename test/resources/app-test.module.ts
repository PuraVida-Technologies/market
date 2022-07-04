import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { rootMongooseTestModule } from '../mongo.connection';
import { MarketplaceModule } from '../../src/marketplace/marketplace.module';
import { AdminModule } from '../../src/admin/admin.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    rootMongooseTestModule(),
    MarketplaceModule,
    AdminModule,
  ],
})
export class AppModule {}

export const setupTestApp = async () => {
  const testBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  const moduleFixture: TestingModule = await testBuilder.compile();

  const app = moduleFixture.createNestApplication();

  function addAppMiddleware(app: INestApplication) {
    //validation for api endpoints
    app.useGlobalPipes(new ValidationPipe());

    //cookie parser for use http only cookie for JWT authentication
    app.use(cookieParser());
    app.use(helmet({ contentSecurityPolicy: false }));
    app.enableCors();
  }

  addAppMiddleware(app);

  return {
    app,
    moduleFixture,
    testBuilder,
    addAppMiddleware,
  };
};
