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
        try {
            const hashed = await bcrypt.hash(dto.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: hashed,
                    role: dto.role,
                },
            });
            return this.signToken(user.id, user.name, user.email, user.role);
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {//when unique not found
                    throw new ForbiddenException('Credentials already exists Mate.');
                }
            }
            throw err;
        }
    }

    //login
    async signin(dto: SigninDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },// finding user using email as it is unique.
        });
        if (!user) {
            throw new ForbiddenException('User not Found in DB.');
        }
        if (!(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid Password');// passowrd not match or user not found.
        }
        return this.signToken(user.id, user.name, user.email, user.role);
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