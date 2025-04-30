// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'nestjs-cloudinary';

@Module({
    imports: [
        CloudinaryModule.forRoot({
            isGlobal: true,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        }),
    ],
    exports: [CloudinaryModule],
})
export class CloudinaryConfigModule { }
