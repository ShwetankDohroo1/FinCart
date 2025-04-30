import { Module } from '@nestjs/common';
import { UseController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers:[UseController],
    providers: [UserService],
    exports:[UserService]
})
export class UserModule {}
