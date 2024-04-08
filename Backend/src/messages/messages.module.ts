import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModel, MessageSchema } from './schema/message';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    MongooseModule.forFeature([
      { name: MessageModel.name, schema: MessageSchema },
    ]),
  ],
})
export class MessagesModule {}
