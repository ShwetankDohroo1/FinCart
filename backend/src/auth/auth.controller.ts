import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { SigninDto } from "./dto/signin.dto";
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
        const { access_token } = await this.authService.signup(dto);
        res.cookie('token', access_token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000,});
        return { message: 'Signup successful', access_token };
    }
    @Post('signin')
    async signin(@Body() dto: SigninDto) {
        console.log(dto);
        return this.authService.signin(dto);
    }
}