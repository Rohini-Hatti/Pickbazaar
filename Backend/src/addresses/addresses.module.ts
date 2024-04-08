import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressModel, AddressSchema } from './schema/address';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService],
  imports: [
    MongooseModule.forFeature([
      { name: AddressModel.name, schema: AddressSchema },
    ]),
  ],
})
export class AddressesModule {}
