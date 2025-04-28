import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    //signup
    async signup(dto: SignupDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ForbiddenException('Credentials already exists Mate.');
        }

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashed,
                role: dto.role,
                cart: dto.role === 'CUSTOMER' ? { create: {} } : undefined,
            },
            include: { cart: true },
        });

        return this.signToken(user.id, user.name, user.email, user.role);
    }

    //login
    async signin(dto: SigninDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },//finding user using email as it is unique.
        });
        if (!user) {
            throw new ForbiddenException('User not Found in DB.');
        }
        if (!(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid Password');//passowrd not match or user not found.
        }
        return this.signToken(user.id, user.name, user.email, user.role);
    }

    //below function is assinging jwt token to user.
    private async signToken(userId: number, name: string, email: string, role: string) {
        const payload = { sub: userId, name, email, role };
        const token = await this.jwtService.signAsync(payload);
        return {
            access_token: token,
            payload,
        };
    }
    async deleteUser(userId: number) {
        return this.prisma.user.delete({
            where: { id: userId }
        });
    }
}