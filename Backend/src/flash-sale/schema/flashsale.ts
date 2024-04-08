import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';
import { ProductModel } from 'src/products/schema/products';

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
export class FlashSaleModel extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  start_date: string;

  @Prop({ required: true })
  end_date: string;

  @Prop()
  image: Attachment;

  @Prop()
  cover_image: Attachment;

  @Prop()
  type: string;

  @Prop()
  rate: string;

  @Prop()
  sale_status: boolean;

  @Prop()
  sale_builder: string;

  @Prop()
  language: string;

  @Prop()
  translated_languages: string[];

  @Prop({ type: [{ type: Types.ObjectId, model: ProductModel.name }] })
  products: ProductModel[];

  @Prop()
  deleted_at: string;
}

export const FlashSaleSchema = SchemaFactory.createForClass(FlashSaleModel);
