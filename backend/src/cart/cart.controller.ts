import { Controller, Post, Get, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class CartController {
    constructor(private readonly cartService: CartService){}
    @Get()
    @Roles('CUSTOMER')
    getCart(@Req() req: RequestWithUser){
        return this.cartService.getCart(req.user['sub']);
    }

    @Post('add/:itemId')
    @Roles('CUSTOMER')
    addItem(@Param('itemId') itemId: string, @Req() req: RequestWithUser){
        return this.cartService.addItem(req.user['sub'], +itemId);
    }

    @Delete('remove/:itemId')
    @Roles('CUSTOMER')
    removeItem(@Param('itemId') itemId: string, @Req() req: RequestWithUser){
        return this.cartService.removeItem(req.user['sub'], +itemId);
    }
}
