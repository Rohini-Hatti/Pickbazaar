import { Module } from '@nestjs/common';
import { FeedbackController } from './feedbacks.controller';
import { FeedbackService } from './feedbacks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModel, FeedbackSchema } from './schema/feedback';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [
    MongooseModule.forFeature([
      { name: FeedbackModel.name, schema: FeedbackSchema },
    ]),
  ],
})
export class FeedbackModule {}
