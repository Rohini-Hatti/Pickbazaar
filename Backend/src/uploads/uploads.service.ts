import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { MimeType } from 'aws-sdk/clients/bedrockagentruntime';

@Injectable()
export class UploadsService {
  private s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  async uploadFiles(files: Array<Express.Multer.File>) {
    const uploadPromises = files.map(async (file) => {
      const { originalname } = file;
      return await this.s3_upload(
        file.buffer,
        process.env.AWS_S3_BUCKET,
        originalname,
        file.mimetype,
      );
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises);

      return uploadedFiles.map((response) => {
        return {
          thumbnail: response.thumbnail,
          original: response.original,
          id: response.id,
        };
      });
    } catch (e) {
      console.error(e.message);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: MimeType,
  ) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();

      return {
        thumbnail: s3Response.Location,
        original: s3Response.Location,
        id: s3Response.ETag,
      };
    } catch (e) {
      console.error(e.message);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // findAll() {
  //   return `This action returns all uploads`;
  // }

  // addOne() {}

  // findOne(id: number) {
  //   return `This action returns a #${id} upload`;
  // }
  async remove(id: string) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: id, // Assuming `id` is the key or filename of the object in S3
    };

    try {
      await this.s3.deleteObject(params).promise();
      return `Successfully removed file with id: ${id}`;
    } catch (error) {
      console.error('Error removing file from S3:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
