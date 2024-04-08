import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController, TopAuthors } from './authors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorModel, AuthorSchema } from './schema/author';

@Module({
  controllers: [AuthorsController, TopAuthors],
  providers: [AuthorsService],
  imports: [
    MongooseModule.forFeature([
      { name: AuthorModel.name, schema: AuthorSchema },
    ]),
  ],
})
export class AuthorsModule {}
