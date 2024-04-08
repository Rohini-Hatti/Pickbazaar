import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import MessagesJson from '@db/messages.json';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetConversationsDto } from 'src/conversations/dto/get-conversations.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MessageModel } from './schema/message';
import mongoose from 'mongoose';
import { paginate } from 'src/common/pagination/paginate';

const messages = plainToClass(Message, MessagesJson);

@Injectable()
export class MessagesService {
  private messages: Message[] = messages;
  constructor(
    @InjectModel(MessageModel.name)
    private messageModel: mongoose.Model<MessageModel>,
  ) {}

  // this method will get updated when it will get connected to frontend and alos this route will get authenticated.
  createMessage(createMessageDto: CreateMessageDto) {
    // return this.messages[0];
    return this.messageModel.create(createMessageDto);
  }

  async getMessages({ search, limit, page }: GetConversationsDto) {
    // const data: Message[] = this.messages;
    // return {
    //   data: data,
    // };
    let query: any = {};

    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        if (key === 'conversation_id') {
          query['conversation_id'] = value;
        } else {
          query[key] = value;
        }
      }
    }
    const messages = await this.messageModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const totalMessages = await this.messageModel.countDocuments(query);
    const url = `messages/conversations?limit=${limit}`;
    return {
      data: messages,
      ...paginate(totalMessages, page, limit, messages.length, url),
    };
  }
}
