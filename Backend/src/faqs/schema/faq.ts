import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Types } from 'mongoose';
import { ShopModel } from 'src/shops/schema/shop';
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
export class FaqModel extends Document {
  @Prop()
  translated_languages: string[];

  @Prop()
  language: string;

  @Prop()
  faq_title: string;

  @Prop()
  slug: string;

  @Prop()
  faq_description: string;

  @Prop({ type: Types.ObjectId, ref: 'ShopModel' })
  shop_id: ShopModel;

  @Prop({ type: Types.ObjectId, ref: 'UsersModel' })
  issued_by: UsersModel;

  @Prop()
  faq_type: string;

  @Prop({ types: Types.ObjectId, ref: 'UsersModel' })
  user_id: UsersModel;

  @Prop()
  deleted_at: string;
}

export const FaqSchema = SchemaFactory.createForClass(FaqModel);
