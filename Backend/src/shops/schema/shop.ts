import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Balance, ShopSettings } from '../entities/shop.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { UserAddress } from 'src/addresses/entities/address.entity';
import { UsersModel } from 'src/users/schema/user';

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
export class ShopModel extends Document {
  @Prop()
  owner_id: number;

  @Prop({ type: Types.ObjectId, ref: 'UsersModel' })
  owner: UsersModel;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'UsersModel' }] })
  staffs: UsersModel[];

  @Prop()
  is_active: boolean;

  @Prop()
  orders_count: number;

  @Prop()
  products_count: number;

  @Prop()
  balance: Balance;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  cover_image: Attachment;

  @Prop()
  logo: Attachment;

  @Prop()
  address: UserAddress;

  @Prop()
  settings: ShopSettings;

  @Prop()
  distance: number;

  @Prop()
  lat: string;

  @Prop()
  lng: string;
}

export const ShopSchema = SchemaFactory.createForClass(ShopModel);
