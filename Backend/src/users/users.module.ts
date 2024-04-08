import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AdminController,
  AllCustomerController,
  AllStaffsController,
  MyStaffsController,
  ProfilesController,
  UsersController,
  VendorController,
} from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModel, UsersSchema } from './schema/user';

@Module({
  controllers: [
    UsersController,
    ProfilesController,
    AdminController,
    VendorController,
    MyStaffsController,
    AllStaffsController,
    AllCustomerController,
  ],
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: UsersModel.name, schema: UsersSchema }]),
  ],
  providers: [UsersService],
})
export class UsersModule {}
