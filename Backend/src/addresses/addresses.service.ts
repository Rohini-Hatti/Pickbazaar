import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AddressModel } from './schema/address';
import mongoose from 'mongoose';
import { UsersModel } from 'src/users/schema/user';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(AddressModel.name)
    private addressModel: mongoose.Model<AddressModel>,
  ) {}
  async create(createAddressDto: CreateAddressDto) {
    return await this.addressModel.create(createAddressDto);
  }

  async findAll() {
    // return `This action returns all addresses`;
    return await this.addressModel
      .find()
      .populate({ path: 'customer', model: UsersModel.name });
  }

  async findOne(id: string) {
    // return `This action returns a #${id} address`;
    const address = await this.addressModel
      .findById(id)
      .populate({ path: 'customer', model: UsersModel.name });
    if (!address) {
      throw new Error(`Could not find the address for ${id}`);
    }
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressModel
      .findById(id)
      .populate({ path: 'customer', model: UsersModel.name });
    if (!address) {
      throw new Error(`Could not find the address for ${id}`);
    }
    await this.addressModel.updateOne({ _id: id }, { $set: updateAddressDto });
    return await this.addressModel.findById(id);
  }

  async remove(id: string) {
    return await this.addressModel.deleteOne({ _id: id });
  }
}
