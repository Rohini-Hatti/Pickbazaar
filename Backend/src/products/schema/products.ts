import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoryModel } from 'src/categories/schema/category';
import { ShopModel } from 'src/shops/schema/shop';
import { TypesModel } from 'src/types/schema/types';
import { v4 as uuidv4 } from 'uuid';

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
export class ProductModel extends Document {
  // changes from number to string
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: uuidv4 })
  type_id: string;

  // @Prop({ required: true })
  @Prop()
  price: number;

  // @Prop({ required: true })
  @Prop()
  sale_price: number;

  @Prop({ required: true })
  language: string;

  // @Prop({ required: true })
  @Prop()
  min_price: number;

  // @Prop({ required: true })
  @Prop()
  max_price: number;

  // @Prop({ required: true })
  @Prop()
  sku: string;

  @Prop({ required: true })
  quantity: number;

  // @Prop({ required: true })
  @Prop()
  in_stock: number;

  // @Prop({ required: true })
  @Prop()
  is_taxable: number;

  @Prop()
  shipping_class_id: number;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  product_type: string;

  @Prop({ required: true })
  unit: string;

  @Prop()
  height: number;

  @Prop()
  width: number;

  @Prop()
  length: number;

  @Prop({ type: Object }) // Assuming that the id, original, and thumbnail are strings
  image: {
    id: string;
    original: string;
    thumbnail: string;
    file_name: string;
  };

  @Prop()
  video: string[];

  @Prop({ type: Object })
  gallery: {
    id: string;
    original: string;
    thumbnail: string;
    file_name: string;
  }[];

  @Prop()
  deleted_at: Date;

  @Prop()
  author_id: number;

  @Prop()
  manufacturer_id: number;

  // @Prop({ required: true })
  @Prop()
  is_digital: number;

  // @Prop({ required: true })
  @Prop()
  is_external: number;

  @Prop()
  external_product_url: string;

  @Prop()
  external_product_button_text: string;

  // @Prop({ required: true })
  @Prop()
  ratings: number;

  // @Prop({ required: true })
  @Prop()
  total_reviews: number;

  @Prop()
  my_review: string;

  // @Prop({ required: true })
  @Prop()
  in_wishlist: boolean;

  @Prop()
  blocked_dates: Date[];

  @Prop({ required: true })
  translated_languages: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'CateoryModel' }] })
  // categories: {
  //   id: number;
  //   name: string;
  //   slug: string;
  //   language: string;
  //   icon: string;
  //   image: string[];
  //   details: string;
  //   parent: string;
  //   type_id: number;
  //   created_at: Date;
  //   updated_at: Date;
  //   deleted_at: Date;
  //   parent_id: string;
  //   translated_languages: string[];
  //   pivot: {
  //     product_id: number;
  //     category_id: number;
  //   };
  // }[];
  categories: CategoryModel[];

  // @Prop({ type: Object })
  // shop: {
  //   id: number;
  //   owner_id: number;
  //   name: string;
  //   slug: string;
  //   description: string;
  //   cover_image: {
  //     id: string;
  //     original: string;
  //     thumbnail: string;
  //   };
  //   logo: {
  //     id: string;
  //     original: string;
  //     thumbnail: string;
  //   };
  //   is_active: number;
  //   address: {
  //     zip: string;
  //     city: string;
  //     state: string;
  //     country: string;
  //     street_address: string;
  //   };
  //   settings: {
  //     contact: string;
  //     socials: {
  //       url: string;
  //       icon: string;
  //     }[];
  //     website: string;
  //     location: {
  //       lat: number;
  //       lng: number;
  //       city: string;
  //       state: string;
  //       country: string;
  //       formattedAddress: string;
  //     };
  //   };
  //   created_at: Date;
  //   updated_at: Date;
  // };
  @Prop({ type: Types.ObjectId, ref: 'ShopModel' })
  shop: ShopModel;

  // @Prop({ type: Object })
  // type: {
  //   id: number;
  //   name: string;
  //   settings: {
  //     isHome: boolean;
  //     layoutType: string;
  //     productCard: string;
  //   };
  //   slug: string;
  //   language: string;
  //   icon: string;
  //   promotional_sliders: {
  //     id: string;
  //     original: string;
  //     thumbnail: string;
  //   }[];
  //   created_at: Date;
  //   updated_at: Date;
  //   translated_languages: string[];
  // };
  @Prop({ type: Types.ObjectId, ref: 'TypesModel' })
  type: TypesModel;

  @Prop()
  variations: string[];

  @Prop()
  metas: string[];

  @Prop()
  manufacturer: string;

  @Prop()
  variation_options: string[];

  @Prop()
  tags: string[];

  @Prop()
  author: string;
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
