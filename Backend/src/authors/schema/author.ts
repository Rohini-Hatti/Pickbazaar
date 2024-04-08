import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';
import { ShopSocials } from 'src/settings/entities/setting.entity';

export class AuthorModel extends Document {
  @Prop()
  bio: string;

  @Prop()
  born: string;

  @Prop()
  cover_image: Attachment;

  @Prop()
  death: string;

  @Prop()
  image: Attachment;

  @Prop()
  is_approved: boolean;

  @Prop()
  languages: string;

  @Prop()
  name: string;

  @Prop()
  products_count: number;

  @Prop()
  quote: string;

  @Prop()
  slug: string;

  @Prop()
  socials: ShopSocials;

  @Prop()
  language: string;

  @Prop()
  translated_languages: string[];
}

export const AuthorSchema = SchemaFactory.createForClass(AuthorModel);
