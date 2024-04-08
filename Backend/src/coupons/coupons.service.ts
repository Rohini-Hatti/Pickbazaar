import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';
import couponsJson from '@db/coupons.json';
import Fuse from 'fuse.js';
import { GetCouponsDto } from './dto/get-coupons.dto';
import { paginate } from 'src/common/pagination/paginate';
import { InjectModel } from '@nestjs/mongoose';
import { CouponModel } from './schema/coupon';
import mongoose from 'mongoose';

const coupons = plainToClass(Coupon, couponsJson);
const options = {
  keys: ['code'],
  threshold: 0.1,
};
const fuse = new Fuse(coupons, options);

@Injectable()
export class CouponsService {
  private coupons: Coupon[] = coupons;
  constructor(
    @InjectModel(CouponModel.name)
    private couponModel: mongoose.Model<CouponModel>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const coupon = await this.couponModel.find({ code: createCouponDto.code });
    if (coupon) {
      throw new Error(`Coupon ${createCouponDto.code} already exists`);
    }
    return await this.couponModel.create(createCouponDto);
  }

  async getCoupons({ search, limit, page, shop_id }: GetCouponsDto) {
    if (!page) page = 1;
    if (!limit) limit = 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Coupon[] = this.coupons;
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }
    let query = {};

    if (shop_id) {
      // data = this.coupons.filter((p) => p.shop_id === Number(shop_id));
      query['shop_id'] = shop_id;
    }

    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // TODO: Temp Solution
        if (key !== 'slug') {
          // searchText.push({
          //   [key]: value,
          // });
          query[key] = value;
        }
      }

      // data = fuse
      //   .search({
      //     $and: searchText,
      //   })
      //   ?.map(({ item }) => item);
    }

    const results = await this.couponModel
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .exec();
    const totalCount = await this.couponModel.countDocuments(query);

    // const results = data.slice(startIndex, endIndex);
    const url = `/coupons?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(totalCount, page, limit, results.length, url),
    };
  }

  async getCoupon(param: string, language: string): Promise<CouponModel> {
    // return this.coupons.find((p) => p.code === param);
    const coupon = await this.couponModel.findOne({ code: param });
    if (!coupon) {
      throw new Error(`Coupon not found ${param}`);
    }

    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const couponExist = await this.couponModel.findOne({ _id: id });
    if (!couponExist) {
      throw new Error(`Coupon not found ${id}`);
    }
    await this.couponModel.updateOne({ _id: id }, { $set: updateCouponDto });
    return await this.couponModel.findById(id);
  }

  async remove(id: string) {
    return await this.couponModel.deleteOne({ _id: id });
  }

  async verifyCoupon(code: string) {
    const coupon = await this.couponModel.findOne({ code: code });
    if (!coupon) {
      throw new Error(`Coupon not found`);
    }
    let is_valid = false;
    if (new Date(coupon.expire_at).getTime() > Date.now()) {
      is_valid = true;
    }
    coupon.is_valid = is_valid;
    await coupon.save();
    // return {
    //   is_valid,
    //   coupon: {
    //     id: 9,
    //     code: code,
    //     description: null,
    //     image: {
    //       id: 925,
    //       original:
    //         'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/925/5x2x.png',
    //       thumbnail:
    //         'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/925/conversions/5x2x-thumbnail.jpg',
    //     },
    //     type: 'fixed',
    //     amount: 5,
    //     active_from: '2021-03-28T05:46:42.000Z',
    //     expire_at: '2024-06-23T05:46:42.000Z',
    //     created_at: '2021-03-28T05:48:16.000000Z',
    //     updated_at: '2021-08-19T03:58:34.000000Z',
    //     deleted_at: null,
    //     is_valid: true,
    //   },
    // };
    return {
      is_valid,
      coupon: coupon,
    };
  }
  async approveCoupon(id: string) {
    // const coupon = this.coupons.find((s) => s.id === Number(id));
    // // coupon.is_approve = true;
    // return coupon;
    const coupon = await this.couponModel.findById(id);
    coupon.is_approve = true;
    await coupon.save();
    return coupon;
  }

  async disapproveCoupon(id: string) {
    // const coupon = this.coupons.find((s) => s.id === Number(id));
    // coupon.is_approve = false;
    // return coupon;
    const coupon = await this.couponModel.findById(id);
    coupon.is_approve = false;
    await coupon.save();
    return coupon;
  }
}
