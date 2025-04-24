import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "prisma/prisma.module";
import { JwtModule as NestJwt } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/jwt/jwt.strategy";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
@Module({
    imports: [PrismaModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        NestJwt.register({
            secret: process.env.JWT_SECRET || 'JWT_SECRET',
            signOptions: { expiresIn: '60m' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,JwtAuthGuard],
    exports:[PassportModule,NestJwt]
})
export class AuthModule {

}