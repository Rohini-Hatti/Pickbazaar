import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import {
  ApproveCouponController,
  CouponsController,
  DisapproveCouponController,
} from './coupons.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { CouponModel, CouponSchema } from './schema/coupon';

@Module({
  controllers: [
    CouponsController,
    ApproveCouponController,
    DisapproveCouponController,
  ],
  providers: [CouponsService],
  imports: [
    MongooseModule.forFeature([
      { name: CouponModel.name, schema: CouponSchema },
    ]),
  ],
})
export class CouponsModule {}
