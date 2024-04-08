import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModel, CategorySchema } from './schema/category';

@Module({
  controllers: [CategoriesController],
  imports: [
    MongooseModule.forFeature([
      { name: CategoryModel.name, schema: CategorySchema },
    ]),
  ],
  providers: [CategoriesService],
})
export class CategoriesModule {}
