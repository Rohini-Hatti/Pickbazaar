import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributesModel, AttributesSchema } from './schema/attributes';

@Module({
  controllers: [AttributesController],
  providers: [AttributesService],
  imports: [
    MongooseModule.forFeature([
      { name: AttributesModel.name, schema: AttributesSchema },
    ]),
  ],
})
export class AttributesModule {}
