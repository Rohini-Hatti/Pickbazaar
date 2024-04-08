import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypesModel, TypesSchema } from './schema/types';

@Module({
  controllers: [TypesController],
  providers: [TypesService],
  imports: [
    MongooseModule.forFeature([{ name: TypesModel.name, schema: TypesSchema }]),
  ],
})
export class TypesModule {}
