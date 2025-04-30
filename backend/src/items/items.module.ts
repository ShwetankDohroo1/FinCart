import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { CloudinaryConfigModule } from 'src/cloudinary/cloudinary.module';
@Module({
    imports:[CloudinaryConfigModule],
    controllers:[ItemsController],
    providers:[ItemsService],
    exports:[ItemsService]
})
export class ItemsModule {}
