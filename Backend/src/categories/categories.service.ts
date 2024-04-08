import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import Fuse from 'fuse.js';
import categoriesJson from '@db/categories.json';
import { paginate } from 'src/common/pagination/paginate';
import { CategoryModel } from './schema/category';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TypesModel } from 'src/types/schema/types';

const categories = plainToClass(Category, categoriesJson);
const options = {
  keys: ['name', 'type.slug'],
  threshold: 0.3,
};
const fuse = new Fuse(categories, options);

@Injectable()
export class CategoriesService {
  private categories: Category[] = categories;
  constructor(
    @InjectModel(CategoryModel.name)
    private Categorymodel: mongoose.Model<CategoryModel>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const newdocs = { ...createCategoryDto, type: createCategoryDto.type_id };
    delete newdocs.type_id;
    const newCategory = await this.Categorymodel.create(newdocs);
    if (newdocs.parent) {
      const parent = await this.Categorymodel.findById(newdocs.parent);
      let child = [...parent.children];
      child.push(newCategory.id);
      parent.children = [...child];
      await parent.save();
    }

    return newCategory;
  }

  async getCategories({ limit, page, search, parent }: GetCategoriesDto) {
    // return await this.Categorymodel.find({})
    //   .populate({ path: 'type_id', model: TypesModel.name })
    //   .exec();

    const query = {};

    // if (search) {
    //   query['$or'] = [
    //     { name: { $regex: search, $options: 'i' } },
    //     { details: { $regex: search, $options: 'i' } },
    //   ];
    // }
    if (search) {
      const searchParams = search.split(';');
      for (const searchParam of searchParams) {
        const [key, value] = searchParam.split(':');
        query[key] = value;
      }
    }

    if (parent === 'null') {
      query['parent'] = null;
    }

    const total = await this.Categorymodel.countDocuments(query);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = await this.Categorymodel.find(query)
      .populate([
        { path: 'type', model: TypesModel.name },
        { path: 'children', model: CategoryModel.name },
        { path: 'parent', model: CategoryModel.name },
      ])
      .skip(startIndex)
      .limit(limit)

      .exec();

    const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;
    return {
      data: results,
      ...paginate(total, page, limit, results.length, url),
    };

    // if (!page) page = 1;
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // let data: Category[] = this.categories;
    // if (search) {
    //   const parseSearchParams = search.split(';');
    //   for (const searchParam of parseSearchParams) {
    //     const [key, value] = searchParam.split(':');
    //     // data = data.filter((item) => item[key] === value);
    //     data = fuse.search(value)?.map(({ item }) => item);
    //   }
    // }
    // if (parent === 'null') {
    //   data = data.filter((item) => item.parent === null);
    // }
    // // if (text?.replace(/%/g, '')) {
    // //   data = fuse.search(text)?.map(({ item }) => item);
    // // }
    // // if (hasType) {
    // //   data = fuse.search(hasType)?.map(({ item }) => item);
    // // }

    // const results = data.slice(startIndex, endIndex);
    // const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;
    // return {
    //   data: results,
    //   ...paginate(data.length, page, limit, results.length, url),
    // };
  }

  async getCategory(param: string, language: string): Promise<CategoryModel> {
    try {
      let category: any = await this.Categorymodel.findOne({ slug: param })
        .populate([
          { path: 'type', model: TypesModel.name },
          { path: 'children', model: CategoryModel.name },
          { path: 'parent', model: CategoryModel.name },
        ])
        .exec();

      if (!category) {
        category = await this.Categorymodel.findById(param)
          .populate([
            { path: 'type', model: TypesModel.name },
            { path: 'children', model: CategoryModel.name },
            { path: 'parent', model: CategoryModel.name },
          ])
          .exec();
      }

      return category;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    console.log(id);
    await this.Categorymodel.updateOne(
      { _id: id },
      { $set: updateCategoryDto },
    );
    return this.Categorymodel.findOne({ _id: id });
  }

  async remove(id: string) {
    return await this.Categorymodel.deleteOne({ _id: id });
  }
}
