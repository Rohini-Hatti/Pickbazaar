import { Injectable } from '@nestjs/common';
import { CreateFeedBackDto } from './dto/create-feedback.dto';
import { UpdateFeedBackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FeedbackModel } from './schema/feedback';
import mongoose from 'mongoose';
import { UsersModel } from 'src/users/schema/user';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(FeedbackModel.name)
    private feedbackModel: mongoose.Model<FeedbackModel>,
  ) {}
  async findAllFeedBacks() {
    return await this.feedbackModel
      .find()
      .populate({ path: 'user_id', model: UsersModel.name });
  }

  async findFeedBack(id: string) {
    const feedback = await this.feedbackModel
      .findById(id)
      .populate({ path: 'user_id', model: UsersModel.name });
    if (feedback) {
      return feedback;
    } else {
      throw new Error(`Feedback for ${id} not found`);
    }
  }

  async create(createFeedBackDto: CreateFeedBackDto) {
    return this.feedbackModel.create(createFeedBackDto);
  }

  async update(id: string, updateFeedbackDto: UpdateFeedBackDto) {
    const feedback = await this.feedbackModel.findById(id);
    if (!feedback) {
      throw new Error(`Feedback for ${id} not found`);
    }
    await this.feedbackModel.updateOne(
      { _id: id },
      { $set: { updateFeedbackDto } },
    );

    return await this.feedbackModel.findById(id);
  }

  async delete(id: string) {
    return this.feedbackModel.deleteOne({ _id: id });
  }
}
