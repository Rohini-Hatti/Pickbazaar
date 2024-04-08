import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

import mongoose, { Types, Document } from 'mongoose';
import { Order } from 'src/orders/entities/order.entity';
import { CouponType } from '../entities/coupon.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { ShopModel } from 'src/shops/schema/shop';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class CouponModel extends Document {
  @Prop()
  code: string;

  @Prop()
  description: string;

  @Prop()
  minimum_cart_amount: number;

  // Need to get updated as it depends on the Order Model
  @Prop()
  orders: Order[];

  @Prop()
  type: CouponType;

  @Prop()
  image: Attachment;

  @Prop()
  is_valid: boolean;

  @Prop()
  amount: number;

  @Prop()
  active_from: string;

  @Prop()
  expire_at: string;

  @Prop()
  language: string;

  @Prop()
  translated_languages: string[];

  @Prop()
  target: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ShopModel' })
  shop_id: ShopModel;

  @Prop()
  is_approve: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(CouponModel);
