import { Injectable } from '@nestjs/common';
import flashSaleJSON from '@db/flash-sale.json';
import ProductsByFlashSaleJSON from '@db/products-by-flash-sale.json';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import { paginate } from 'src/common/pagination/paginate';
import { FlashSale } from './entities/flash-sale.entity';
import { GetFlashSaleDto } from './dto/get-flash-sales.dto';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { Product } from 'src/products/entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FlashSaleModel } from './schema/flashsale';
import mongoose from 'mongoose';
import { ProductModel } from 'src/products/schema/products';

const flashSale = plainToClass(FlashSale, flashSaleJSON);
const options = {
  keys: ['title'],
  threshold: 0.3,
};
const fuse = new Fuse(flashSale, options);

const productsByFlashSale = plainToClass(Product, ProductsByFlashSaleJSON);
const productsByFlashSaleOptions = {
  keys: ['name'],
  threshold: 0.3,
};
const productsByFlashSaleFuse = new Fuse(
  productsByFlashSale,
  productsByFlashSaleOptions,
);

@Injectable()
export class FlashSaleService {
  private flashSale: FlashSale[] = flashSale;
  private productsByFlashSale: Product[] = productsByFlashSale;

  constructor(
    @InjectModel(FlashSaleModel.name)
    private flashSaleModel: mongoose.Model<FlashSaleModel>,
  ) {}

  async create(createFlashSaleDto: CreateFlashSaleDto) {
    return await this.flashSaleModel.create(createFlashSaleDto);
    // return this.flashSale[0];
  }

  async findAllFlashSale({ search, limit, page }: GetFlashSaleDto) {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // let data: FlashSale[] = this.flashSale;

    let query = {};

    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        query[key] = value;

        // data = fuse.search(value)?.map(({ item }) => item);
      }
    }
    const data = await this.flashSaleModel.countDocuments(query);
    const results = await this.flashSaleModel
      .find(query)
      .populate({ path: 'products', model: ProductModel.name })
      .skip(startIndex)
      .limit(limit)
      .exec();

    // const results = data.slice(startIndex, endIndex);
    const url = `/flash-sale?search=${search}&limit=${limit}`;
    return {
      data: results,
      // ...paginate(data.length, page, limit, results.length, url),
      ...paginate(data, page, limit, results.length, url),
    };
  }

  async getFlashSale(param: string, language: string) {
    // return this.flashSale.find((p) => p.slug === param);
    return await this.flashSaleModel
      .findOne({ slug: param })
      .populate({ path: 'products', model: ProductModel.name });
  }

  async update(id: string, updateFlashSaleDto: UpdateFlashSaleDto) {
    // return this.flashSale[0];
    await this.flashSaleModel.updateOne(
      { _id: id },
      { $set: updateFlashSaleDto },
    );
    return (await this.flashSaleModel.findById(id)).populate({
      path: 'products',
      model: ProductModel.name,
    });
  }

  async remove(id: string) {
    // return `This action removes a #${id} Flash Sale`;
    return await this.flashSaleModel.deleteOne({ _id: id });
  }

  // findAllProductsByFlashSale({ search, limit, page }: GetFlashSaleDto) {
  //   if (!page) page = 1;
  //   if (!limit) limit = 10;
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  //   let productsByData: Product[] = this.productsByFlashSale;

  //   if (search) {
  //     const parseSearchParams = search.split(';');
  //     for (const searchParam of parseSearchParams) {
  //       const [key, value] = searchParam.split(':');
  //       productsByData = productsByFlashSaleFuse
  //         .search(value)
  //         ?.map(({ item }) => item);
  //     }
  //   }

  //   const results = productsByData.slice(startIndex, endIndex);
  //   const url = `/products-by-flash-sale?search=${search}&limit=${limit}`;
  //   return {
  //     data: results,
  //     ...paginate(productsByData.length, page, limit, results.length, url),
  //   };
  // }

  // THis method might get change if frontend is asking only products of the selected flash sale created by selected seller.
  // Based on the frontend requirement, this will get change.
  async findAllProductsByFlashSale({ search, limit, page }: GetFlashSaleDto) {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const productQuery = {};
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        productQuery[key] = value;
      }
    }

    try {
      const flashSales = await this.flashSaleModel.find().populate({
        path: 'products',
        match: productQuery,
      });

      const allProducts = flashSales.reduce((products, flashSale) => {
        if (flashSale.products) {
          products.push(...flashSale.products);
        }
        return products;
      }, []);

      const totalProducts = allProducts.length;
      const paginatedProducts = allProducts.slice(startIndex, endIndex);

      const url = `/products-by-flash-sale?search=${search}&limit=${limit}`;
      return {
        data: paginatedProducts,
        ...paginate(totalProducts, page, limit, paginatedProducts.length, url),
      };
    } catch (error) {
      console.error('Error fetching products by flash sale:', error);
      throw error;
    }
  }
}
