import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Types } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import { Category } from '../entities/category.entity';
import { Attachment } from 'src/common/entities/attachment.entity';

import { Product } from 'src/products/entities/product.entity';
import { TypesModel } from 'src/types/schema/types';

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
export class CategoryModel extends Document {
  // @Prop({ default: uuidv4 })
  // id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  parent: Category;

  @Prop()
  children: Category[];

  @Prop()
  details: string;

  @Prop()
  image: Attachment;

  @Prop()
  icon: string;

  @Prop({ type: Types.ObjectId, ref: 'TypesModel' })
  type: TypesModel;

  @Prop()
  products: Product[];

  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  translated_language: string[];
}

export const CategorySchema = SchemaFactory.createForClass(CategoryModel);
