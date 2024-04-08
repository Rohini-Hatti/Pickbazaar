import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import {
  ApproveShopController,
  DisapproveShopController,
  ShopsController,
  StaffsController,
  NearByShopController,
  NewShopsController,
} from './shops.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopModel, ShopSchema } from './schema/shop';

@Module({
  controllers: [
    ShopsController,
    StaffsController,
    DisapproveShopController,
    ApproveShopController,
    NearByShopController,
    NewShopsController,
  ],
  imports: [
    MongooseModule.forFeature([{ name: ShopModel.name, schema: ShopSchema }]),
  ],
  providers: [ShopsService],
})
export class ShopsModule {}
