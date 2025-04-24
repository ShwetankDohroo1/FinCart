import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ItemsModule } from './items/items.module';
import { PrismaService } from './prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CartModule } from './cart/cart.module';
@Module({
  imports: [AuthModule, UserModule, ItemsModule, PrismaModule, JwtModule, CartModule],
  providers: [PrismaService],
})
export class AppModule {

}