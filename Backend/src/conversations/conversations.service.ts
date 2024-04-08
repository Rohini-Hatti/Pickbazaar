import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import ConversationsJson from '@db/conversations.json';
import Fuse from 'fuse.js';
import { paginate } from 'src/common/pagination/paginate';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { GetConversationsDto } from './dto/get-conversations.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ConversationModel } from './schema/conversation';
import mongoose from 'mongoose';

// For conversations
const conversations = plainToClass(Conversation, ConversationsJson);
const options = {
  keys: ['shop.name'],
  threshold: 0.3,
};
const fuse = new Fuse(conversations, options);

@Injectable()
export class ConversationsService {
  private conversations: Conversation[] = conversations;
  constructor(
    @InjectModel(ConversationModel.name)
    private conversationModel: mongoose.Model<ConversationModel>,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    //more stuffs need to be done based ont the data arrived from the frontend and when this route will be authenticated
    return await this.conversationModel.create(createConversationDto);
  }

  async getAllConversations({ page, limit, search }: GetConversationsDto) {
    // if (!page) page = 1;
    // let data: Conversation[] = this.conversations;
    // if (search) {
    //   const parseSearchParams = search.split(';');
    //   const test = data.filter((p) => p.shop.name);
    //   const searchText: any = [];
    //   for (const searchParam of parseSearchParams) {
    //     const [key, value] = searchParam.split(':');
    //     // TODO: Temp Solution
    //     if (key !== 'slug') {
    //       searchText.push({
    //         [key]: value,
    //       });
    //     }
    //   }
    //   data = fuse
    //     .search({
    //       $and: searchText,
    //     })
    //     ?.map(({ item }) => item);
    // }

    // const url = `/conversations?limit=${limit}`;
    // return {
    //   data,
    //   ...paginate(
    //     this.conversations.length,
    //     page,
    //     limit,
    //     this.conversations.length,
    //     url,
    //   ),
    // };
    let query: any = {};
    let aggregationPipeline: any = [];

    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');

        if (key === 'shop') {
          query['shop.name'] = value;
        } else if (key === 'user') {
          query['user.name'] = value;
        } else {
          query[key] = value;
        }
      }
      aggregationPipeline.push({ $match: query });
    }
    aggregationPipeline.push(
      {
        $lookup: {
          from: 'UsersModel',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'ShopModel',
          localField: 'shop',
          foreignField: '_id',
          as: 'shop',
        },
      },
      { $unwind: '$user' },
      { $unwind: '$shop' },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          data: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          totalItems: 1,
          data: 1,
        },
      },
    );

    const result = await this.conversationModel.aggregate(aggregationPipeline);
    const conversations = result.length > 0 ? result[0].data : [];
    const totalConversations = result.length > 0 ? result[0].totalItems : 0;
    const url = `/conversations?limit=${limit}`;
    return {
      data: conversations,
      ...paginate(totalConversations, page, limit, conversations.length, url),
    };
  }

  async getConversation(param: string) {
    // return this.conversations.find(
    //   (p) => Number(p.latest_message.conversation_id) === Number(param),
    // );
    const conversation = await this.conversationModel.findById(param);
    if (conversation) {
      return conversation;
    }
    return {};
  }
}
