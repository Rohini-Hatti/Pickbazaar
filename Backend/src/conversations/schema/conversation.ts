import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ShopModel } from 'src/shops/schema/shop';
import { UsersModel } from 'src/users/schema/user';
import { LatestMessage } from '../entities/conversation.entity';

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
export class ConversationModel extends Document {
  @Prop()
  shop_id: string;

  @Prop()
  unseen: boolean;

  @Prop()
  user_id: string;

  @Prop({ type: Types.ObjectId, model: UsersModel.name })
  user: UsersModel;

  @Prop({ type: Types.ObjectId, model: ShopModel.name })
  shop: ShopModel;

  @Prop()
  latest_message: LatestMessage;
}

export const ConversationSchema =
  SchemaFactory.createForClass(ConversationModel);
