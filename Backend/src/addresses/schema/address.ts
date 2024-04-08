import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';
import { UserAddress } from '../entities/address.entity';
import { AddressType } from 'aws-sdk/clients/snowball';
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
export class AddressModel extends Document {
  @Prop()
  title: string;

  @Prop()
  default: boolean;

  @Prop()
  address: UserAddress;

  @Prop()
  type: AddressType;

  @Prop({ type: Types.ObjectId, ref: 'UsersModel' })
  customer: UsersModel;
}

export const AddressSchema = SchemaFactory.createForClass(AddressModel);
