import { Module } from '@nestjs/common';
import { ItemController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
    controllers:[ItemController],
    providers:[ItemsService],
    exports:[ItemsService]
})
export class ItemsModule {}
