import { Injectable } from '@nestjs/common';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { plainToClass } from 'class-transformer';
import authorsJson from '@db/authors.json';
import { Author } from './entities/author.entity';
import Fuse from 'fuse.js';
import { GetAuthorDto } from './dto/get-author.dto';
import { paginate } from '../common/pagination/paginate';
import { GetTopAuthorsDto } from './dto/get-top-authors.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AuthorModel } from './schema/author';
import mongoose from 'mongoose';

const authors = plainToClass(Author, authorsJson);

const options = {
  keys: ['name', 'slug'],
  threshold: 0.3,
};

const fuse = new Fuse(authors, options);

@Injectable()
export class AuthorsService {
  private authors: Author[] = authors;
  constructor(
    @InjectModel(AuthorModel.name)
    private authorModel: mongoose.Model<AuthorModel>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return await this.authorModel.create(createAuthorDto);
  }

  async getAuthors({ page, limit, search }: GetAuthorDto) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // let data: Author[] = this.authors;
    let query = {};
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // data = fuse.search(value)?.map(({ item }) => item);
        query[key] = value;
      }
    }

    // const results = data.slice(startIndex, endIndex);
    const totalData = await this.authorModel.countDocuments(query);
    const results = await this.authorModel
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .exec();

    const url = `/authors?search=${search}&limit=${limit}`;
    return {
      data: results,
      // ...paginate(data.length, page, limit, results.length, url),
      ...paginate(totalData, page, limit, results.length, url),
    };
  }

  async getAuthorBySlug(slug: string): Promise<AuthorModel> {
    // return this.authors.find((p) => p.slug === slug);
    const author = await this.authorModel.findOne({ slug: slug });
    if (!author) {
      throw new Error(`Author for given slug ${slug} not found`);
    }
    return author;
  }

  async getTopAuthors({
    limit = 10,
  }: GetTopAuthorsDto): Promise<AuthorModel[]> {
    // return this.authors.slice(0, limit);
    return await this.authorModel.find().limit(limit);
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    // const author = this.authors.find((p) => p.id === Number(id));
    const author = await this.authorModel.findById(id);
    author.is_approved = updateAuthorDto.is_approved ?? true;
    await author.save();

    // Update author
    // author.is_approved = updateAuthorDto.is_approved ?? true;

    return await this.authorModel.findById(id);
  }

  remove(id: string) {
    return this.authorModel.deleteOne({ _id: id });
  }
}
