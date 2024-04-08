import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Types } from 'mongoose';
import { AttributeValue } from '../entities/attribute-value.entity';
// import { v4 as uuidv4 } from 'uuid';

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
export class AttributesModel extends Document {
  @Prop()
  name: string;

  @Prop()
  shop_id: string;

  @Prop()
  slug: string;

  @Prop()
  values: AttributeValue[];

  @Prop()
  language: string;

  @Prop()
  translated_languages: string[];
}

export const AttributesSchema = SchemaFactory.createForClass(AttributesModel);
