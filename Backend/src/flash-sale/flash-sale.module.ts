import { Module } from '@nestjs/common';
import {
  FlashSaleController,
  ProductsByFlashSaleController,
} from './flash-sale.controller';
import { FlashSaleService } from './flash-sale.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashSaleModel, FlashSaleSchema } from './schema/flashsale';

@Module({
  controllers: [FlashSaleController, ProductsByFlashSaleController],
  providers: [FlashSaleService],
  imports: [
    MongooseModule.forFeature([
      { name: FlashSaleModel.name, schema: FlashSaleSchema },
    ]),
  ],
})
export class FlashSaleModule {}
