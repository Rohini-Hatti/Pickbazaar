import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('attachments')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files')) // 'files' is the field name for multiple files
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.uploadsService.uploadFiles(files);
  }
}
