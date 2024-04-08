import { Injectable } from '@nestjs/common';
import { GetFaqsDto } from './dto/get-faqs.dto';
import faqsJSON from '@db/faqs.json';
import { Faq } from './entities/faq.entity';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import { paginate } from 'src/common/pagination/paginate';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FaqModel } from './schema/faq';
import mongoose from 'mongoose';
import { ShopModel } from 'src/shops/schema/shop';
import { UsersModel } from 'src/users/schema/user';
import { start } from 'repl';

const faqs = plainToClass(Faq, faqsJSON);
const options = {
  keys: ['faq_title'],
  threshold: 0.3,
};
const fuse = new Fuse(faqs, options);

@Injectable()
export class FaqsService {
  private faqs: Faq[] = faqs;
  constructor(
    @InjectModel(FaqModel.name)
    private faqModel: mongoose.Model<FaqModel>,
  ) {}

  async create(createFaqDto: CreateFaqDto) {
    try {
      return await this.faqModel.create(createFaqDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllFaqs({ search, limit, page, shop_id }: GetFaqsDto) {
    // if (!page) page = 1;
    // if (!limit) limit = 10;
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // let data: Faq[] = this.faqs;
    // if (shop_id) {
    //   data = this.faqs.filter((p) => Number(p.shop_id) === Number(shop_id));
    // }
    // if (search) {
    //   const parseSearchParams = search.split(';');
    //   for (const searchParam of parseSearchParams) {
    //     const [key, value] = searchParam.split(':');
    //     data = fuse.search(value)?.map(({ item }) => item);
    //   }
    // }
    // let results = data.slice(startIndex, endIndex);
    // if (results.length == 0) {
    //   results = this.faqs.slice(0, limit);
    // }
    // const url = `/faqs?search=${search}&limit=${limit}`;
    // return {
    //   data: results,
    //   ...paginate(data.length, page, limit, results.length, url),
    // };
    if (!page) page = 1;
    if (!limit) limit = 10;

    let query = {};

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (shop_id) {
      query['shop_id'] = shop_id;
    }
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        query[key] = value;
      }
    }
    const totalResult = await this.faqModel.countDocuments(query);
    let results = await this.faqModel
      .find(query)
      .populate([
        {
          path: 'shop_id',
          model: ShopModel.name,
        },
        { path: 'issued_by', model: UsersModel.name },
        { path: 'user_id', model: UsersModel.name },
      ])
      .skip(startIndex)
      .limit(limit);
    if (results.length == 0) {
      results = await this.faqModel
        .find(query)
        .populate([
          {
            path: 'shop_id',
            model: ShopModel.name,
          },
          { path: 'issued_by', model: UsersModel.name },
          { path: 'user_id', model: UsersModel.name },
        ])
        .skip(0)
        .limit(limit);
    }
    const url = `/faqs?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(totalResult, page, limit, results.length, url),
    };
  }

  async getFaq(param: string, language: string) {
    const faq = (await this.faqModel.findById(param)).populate([
      {
        path: 'shop_id',
        model: ShopModel.name,
      },
      { path: 'issued_by', model: UsersModel.name },
      { path: 'user_id', model: UsersModel.name },
    ]);
    if (!faq) {
      throw new Error(`Faq for ${param} not found`);
    }
    return faq;
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    const Faq = await this.faqModel.findById(id);
    if (!Faq) {
      throw new Error(`Faq for ${id} not found`);
    }
    await this.faqModel.updateOne({ _id: id }, { $set: updateFaqDto });
    return await this.faqModel.findById(id).populate([
      {
        path: 'shop_id',
        model: ShopModel.name,
      },
      { path: 'issued_by', model: UsersModel.name },
      { path: 'user_id', model: UsersModel.name },
    ]);
  }

  async remove(id: string) {
    return await this.faqModel.deleteOne({ _id: id });
  }
}
