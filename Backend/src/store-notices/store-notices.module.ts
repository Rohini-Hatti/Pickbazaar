import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { StoreNoticesController } from './store-notices.controller';
import { StoreNoticesService } from './store-notices.service';
import { UsersModel, UsersSchema } from 'src/users/schema/user';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [StoreNoticesController],
  providers: [StoreNoticesService, UsersService],
  imports: [
    MongooseModule.forFeature([{ name: UsersModel.name, schema: UsersSchema }]),
  ],
})
export class StoreNoticesModule {}
