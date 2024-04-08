import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

import typesJson from '@db/types.json';
import Fuse from 'fuse.js';
import { GetTypesDto } from './dto/get-types.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TypesModel } from './schema/types';
import mongoose from 'mongoose';

const types = plainToClass(Type, typesJson);
const options = {
  keys: ['name'],
  threshold: 0.3,
};
const fuse = new Fuse(types, options);

@Injectable()
export class TypesService {
  private types: Type[] = types;
  constructor(
    @InjectModel(TypesModel.name)
    private Typesmodel: mongoose.Model<TypesModel>,
  ) {}

  async getTypes({ text, search }: GetTypesDto) {
    try {
      let query: any = {};
      if (search) {
        const searchParams = search.split(';');
        for (const searchParam of searchParams) {
          const [key, value] = searchParam.split(':');
          query[key] = value;
        }
      }
      const data = await this.Typesmodel.find(query);
      return data;
    } catch (error) {
      // Handle any errors
      console.error('Error finding products:', error);
      throw error;
    }

    // let data: Type[] = this.types;

    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }

    // if (search) {
    //   const parseSearchParams = search.split(';');
    //   const searchText: any = [];
    //   for (const searchParam of parseSearchParams) {
    //     const [key, value] = searchParam.split(':');
    //     // TODO: Temp Solution
    //     if (key !== 'slug') {
    //       searchText.push({
    //         [key]: value,
    //       });
    //     }
    //   }
    //   console.log(searchText);

    //   data = fuse
    //     .search({
    //       $and: searchText,
    //     })
    //     ?.map(({ item }) => item);
    // }

    // return data;
  }

  async getTypeBySlug(slug: string): Promise<Type> {
    return await this.Typesmodel.findOne({ slug: slug });
  }

  async create(createTypeDto: CreateTypeDto) {
    return await this.Typesmodel.create(createTypeDto);
  }

  findAll() {
    return `This action returns all types`;
  }

  findOne(id: number) {
    return `This action returns a #${id} type`;
  }

  async update(id: string, updateTypeDto: UpdateTypeDto) {
    await this.Typesmodel.updateOne({ _id: id }, { $set: updateTypeDto });
    return this.Typesmodel.findOne({ _id: id });
  }

  async remove(id: string) {
    return await this.Typesmodel.deleteOne({ _id: id });
  }
}
