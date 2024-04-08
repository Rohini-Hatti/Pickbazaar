import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';
import { Banner, TypeSettings } from '../entities/type.entity';

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
export class TypesModel extends Document {
  // @Prop({ default: uuidv4 })
  // id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  image: Attachment;

  @Prop()
  icon: string;

  @Prop()
  banners: Banner[];

  @Prop()
  promotional_sliders: Attachment[];

  @Prop()
  settings?: TypeSettings;

  @Prop()
  language: string;

  @Prop()
  translated_languages: string[];
}

export const TypesSchema = SchemaFactory.createForClass(TypesModel);
