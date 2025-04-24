import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ItemsModule } from './items/items.module';
import { PrismaService } from './prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [AuthModule, UserModule, ItemsModule, PrismaModule, JwtModule],
  providers: [PrismaService],
})
export class AppModule {

}