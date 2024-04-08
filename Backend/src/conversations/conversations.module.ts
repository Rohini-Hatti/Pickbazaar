import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModel, ConversationSchema } from './schema/conversation';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService],
  imports: [
    MongooseModule.forFeature([
      { name: ConversationModel.name, schema: ConversationSchema },
    ]),
  ],
})
export class ConversationsModule {}
