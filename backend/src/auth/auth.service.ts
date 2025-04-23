import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    //signup
    async signup(dto: SignupDto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashed,
                role: dto.role,
            },
        });
        return this.signToken(user.id,user.name, user.email, user.role);
    }

    //login
    async signin(dto: SigninDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid Credentials');
        }
        return this.signToken(user.id,user.name, user.email, user.role);
    }

    //below function is assinging jwt token to user.
    private signToken(userId: number, name: string, email: string, role: string) {
        const payload = { sub: userId, name, email, role };
        return {
            access_token: this.jwtService.sign(payload),
            payload,
        };
    }
}