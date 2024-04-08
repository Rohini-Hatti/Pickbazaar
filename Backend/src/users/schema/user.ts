import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Social } from '../entities/profile.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { ShopModel } from 'src/shops/schema/shop';
import { Address } from 'src/addresses/entities/address.entity';
import { Permission } from '../entities/user.entity';

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
export class UsersModel extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'UsersModel' })
  profile: {
    avatar: Attachment;
    bio: string;
    socials: Social[];
    contact: string;
    customer: UsersModel;
  };

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ShopModel' }] })
  shops: ShopModel[];

  @Prop({ type: Types.ObjectId, ref: 'ShopModel' })
  managed_shop: ShopModel;

  @Prop()
  is_active: boolean = true;

  @Prop({ type: { type: Types.ObjectId, ref: 'UsersModel' } })
  address: Address[];

  @Prop()
  // permissions: Permission[];
  permissions: string[];
  // orders?: Order[];
  @Prop({ type: Types.ObjectId, ref: 'UsersModel' })
  wallet: {
    id: string;
    total_points: number;
    points_used: number;
    customer_id: UsersModel;
    available_points: number;
    created_at: Date;
    updated_at: Date;
  };
}
export const UsersSchema = SchemaFactory.createForClass(UsersModel);
