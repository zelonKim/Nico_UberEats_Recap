import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'kimchiUberEats1860';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: 'ASFOIEJEKLWREWJ2DFL',
        secretAccessKey: 'fkdljfoflke343lkjser0rklrjwet9tejk',
      },
    });
    try {
      const objectName = `${Date.now() + file.originalname}`;

      await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();

      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (err) {
      console.log(err);
    }
  }
}
