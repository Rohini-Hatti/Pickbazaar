import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ConversationModel } from 'src/conversations/schema/conversation';

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
export class MessageModel extends Document {
  @Prop()
  conversation_id: string;

  @Prop()
  body: string;

  @Prop({ type: Types.ObjectId, model: UsersModel.name })
  user_id: UsersModel;

  @Prop({ type: Types.ObjectId, model: ConversationModel.name })
  conversation: ConversationModel;
}

export const MessageSchema = SchemaFactory.createForClass(MessageModel);
