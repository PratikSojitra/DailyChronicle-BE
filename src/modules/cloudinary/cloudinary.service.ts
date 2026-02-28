import { Injectable } from '@nestjs/common';
import {
    v2 as cloudinary,
    UploadApiErrorResponse,
    UploadApiResponse,
} from 'cloudinary';
import * as toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
        folder: string = 'daily_chronicle',
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) return resolve(result);
                    reject(new Error('Upload to Cloudinary returned undefined result'));
                },
            );

            toStream(file.buffer).pipe(upload);
        });
    }
}
