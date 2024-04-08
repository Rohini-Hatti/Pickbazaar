import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import attributesJson from '@db/attributes.json';
import { Attribute } from './entities/attribute.entity';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { AttributesModel } from './schema/attributes';
import mongoose from 'mongoose';

const attributes = plainToClass(Attribute, attributesJson);

@Injectable()
export class AttributesService {
  private attributes: Attribute[] = attributes;
  constructor(
    @InjectModel(AttributesModel.name)
    private attributesModel: mongoose.Model<AttributesModel>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto) {
    return await this.attributesModel.create(createAttributeDto);
  }

  async findAll() {
    return await this.attributesModel.find();
  }

  async findOne(param: string) {
    let attr = await this.attributesModel.findOne({ slug: param });
    if (!attr) {
      attr = await this.attributesModel.findById(param);
    }
    if (!attr) {
      throw new Error(`Attributes for id ${param} not found`);
    }
    return attr;
  }

  async update(id: string, updateAttributeDto: UpdateAttributeDto) {
    await this.attributesModel.updateOne(
      { _id: id },
      { $set: updateAttributeDto },
    );

    return await this.attributesModel.findById(id);
  }

  async remove(id: string) {
    return await this.attributesModel.deleteOne({ _id: id });
  }
}
