import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import shopsJson from '@db/shops.json';
import nearShopJson from '@db/near-shop.json';
import Fuse from 'fuse.js';
import { GetShopsDto } from './dto/get-shops.dto';
import { paginate } from 'src/common/pagination/paginate';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ShopModel } from './schema/shop';
import mongoose from 'mongoose';
import * as geolib from 'geolib';
import { UsersModel } from 'src/users/schema/user';

const shops = plainToClass(Shop, shopsJson);
const nearShops = plainToClass(Shop, nearShopJson);
const options = {
  keys: ['name', 'type.slug', 'is_active'],
  threshold: 0.3,
};
const fuse = new Fuse(shops, options);

@Injectable()
export class ShopsService {
  private shops: Shop[] = shops;
  private nearShops: Shop[] = shops;
  constructor(
    @InjectModel(ShopModel.name)
    private Shopmodel: mongoose.Model<ShopModel>,
  ) {}

  async create(createShopDto: CreateShopDto) {
    return await this.Shopmodel.create(createShopDto);
  }

  async getShops({ search, limit, page }: GetShopsDto) {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // let data: Shop[] = this.shops;
    const query: any = {};

    if (search) {
      const searchParams = search.split(';');
      for (const searchParam of searchParams) {
        const [key, value] = searchParam.split(':');
        query[key] = value;
      }
    }
    const total = await this.Shopmodel.countDocuments(query);

    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }
    // const results = data.slice(startIndex, endIndex);
    const results = await this.Shopmodel.find(query)
      .populate({
        path: 'staffs',
        model: UsersModel.name,
      })
      .skip(startIndex)
      .limit(limit)
      .exec();

    const url = `/shops?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(total, page, limit, results.length, url),
    };
  }

  async getStaffs({ shop_id, limit, page }: GetStaffsDto) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // let staffs: Shop['staffs'] = [];
    // if (shop_id) {
    //   staffs = this.shops.find((p) => p.id === Number(shop_id))?.staffs ?? [];
    // }
    // const results = staffs?.slice(startIndex, endIndex);
    const results = await this.Shopmodel.findOne({ _id: shop_id })
      .populate({
        path: 'staffs',
        model: UsersModel.name,
      })
      .select('staffs');
    const totalCount = results.staffs.length;
    const staffs = results.staffs.slice(startIndex, endIndex);
    const url = `/staffs?limit=${limit}`;

    return {
      data: staffs,
      ...paginate(totalCount, page, limit, staffs?.length, url),
    };
  }

  async getShop(slug: string): Promise<ShopModel> {
    const shop = await this.Shopmodel.findOne({ slug: slug });
    if (!shop) {
      throw new Error('no shop found');
    }
    // return this.shops.find((p) => p.slug === slug);
    return shop;
  }

  async getNearByShop(lat: string, lng: string): Promise<ShopModel[]> {
    // return nearShops
    // const radiusInKilometers = 5;
    // const shops = await this.Shopmodel.find({
    //   location: {
    //     $nearSphere: {
    //       $geometry: {
    //         type: 'Point',
    //         coordinates: [parseFloat(lng), parseFloat(lat)],
    //       },
    //       $maxDistance: radiusInKilometers * 1000,
    //     },
    //   },
    // });

    //without given the distance
    // const radiusInKilometers = 5;

    // const latFloat = parseFloat(lat);
    // const lngFloat = parseFloat(lng);

    // const shops = await this.Shopmodel.find({
    //   lat: {
    //     $gte: (latFloat - (1 / 111.12) * radiusInKilometers).toString(),
    //     $lte: (latFloat + (1 / 111.12) * radiusInKilometers).toString(),
    //   },
    //   lng: {
    //     $gte: (
    //       lngFloat -
    //       (1 / (111.12 * Math.cos(latFloat * (Math.PI / 180)))) *
    //         radiusInKilometers
    //     ).toString(),
    //     $lte: (
    //       lngFloat +
    //       (1 / (111.12 * Math.cos(latFloat * (Math.PI / 180)))) *
    //         radiusInKilometers
    //     ).toString(),
    //   },
    // });
    const userLocation = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    };

    const shops = await this.Shopmodel.find().lean();
    const nearbyShops = shops.filter((shop) => {
      const shopLocation = {
        latitude: parseFloat(shop.lat),
        longitude: parseFloat(shop.lng),
      };
      const distance = geolib.getDistance(userLocation, shopLocation);
      return distance <= shop.distance;
    });

    return nearbyShops;
  }

  async update(id: string, updateShopDto: UpdateShopDto) {
    const shop = await this.Shopmodel.updateOne(
      { _id: id },
      { $set: updateShopDto },
    );
    return await this.Shopmodel.findById(id);
  }

  approve(id: string) {
    return `This action removes a #${id} shop`;
  }

  async remove(id: string) {
    await this.Shopmodel.deleteOne({ _id: id });
  }

  async disapproveShop(id: string) {
    // const shop = this.shops.find((s) => s.id === Number(id));
    // shop.is_active = false;

    const shop = await this.Shopmodel.findById(id);
    shop.is_active = false;
    await shop.save();

    return shop;
  }

  async approveShop(id: string) {
    // const shop = this.shops.find((s) => s.id === Number(id));
    // shop.is_active = true;
    const shop = await this.Shopmodel.findById(id);
    shop.is_active = true;
    await shop.save();

    return shop;
  }
}
