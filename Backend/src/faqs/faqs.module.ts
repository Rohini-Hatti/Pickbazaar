import { Module } from '@nestjs/common';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FaqModel, FaqSchema } from './schema/faq';

@Module({
  controllers: [FaqsController],
  providers: [FaqsService],
  imports: [
    MongooseModule.forFeature([{ name: FaqModel.name, schema: FaqSchema }]),
  ],
})
export class FaqsModule {}
