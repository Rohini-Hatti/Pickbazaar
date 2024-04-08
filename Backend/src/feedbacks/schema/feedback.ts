import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Types } from 'mongoose';
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
export class FeedbackModel extends Document {
  @Prop({ type: Types.ObjectId, ref: 'UsersModel' })
  user_id: UsersModel;

  @Prop()
  model_type: string;

  @Prop()
  model_id: string;

  @Prop()
  positive: boolean;

  @Prop()
  negative: boolean;
}

export const FeedbackSchema = SchemaFactory.createForClass(FeedbackModel);
