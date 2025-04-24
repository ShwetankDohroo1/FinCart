import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }
    //checking if cart exists or not
    private async ensureCart(userId: number) {
        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await this.prisma.cart.create({ data: { userId } });
        }
        return cart;
    }
    //getting all the data in cart
    async getCart(userId: number) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { item: true }, //bring in full item details
                },
            },
        });
    }
    //adding items to cart using unique key pair 
    async addItem(userId: number, itemId: number) {
        const item = await this.prisma.item.findUnique({ where: { id: itemId } });
        if(!item) 
            throw new NotFoundException(`Item #${itemId} not found.`);
        
        const cart = await this.ensureCart(userId);
        const existing = await this.prisma.cartItem.findFirst({
            where: { cartId: cart.id, itemId },
        });
        //if cart exists
        if (existing) {
            await this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: { increment: 1 } },
            });
        }
        //else create one cart for that specific user
        else {
            await this.prisma.cartItem.create({
                data: {
                    cart: { connect: { id: cart.id } },
                    item: { connect: { id: itemId } },
                },
            });
        }
        const updated = await this.getCart(userId);
        return { message: 'Item added to cart successfully!', cart: updated };
    }


    async removeItem(userId: number, itemId: number) {
        const cart = await this.ensureCart(userId);
        const existing = await this.prisma.cartItem.findUnique({
            where: {
                cartId_itemId: { cartId: cart.id, itemId },
            },
        });
        //if item inside the cart is not present
        if (!existing) {
            throw new NotFoundException(`Item #${itemId} not in cart.`);
        }
        //if cart size is > 1
        if (existing.quantity > 1) {
            //then update the cart not delete
            await this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: { decrement: 1 } },
            });
        }
        //else delete it
        else {
            await this.prisma.cartItem.delete({ where: { id: existing.id } });
        }
        const updated = await this.getCart(userId);
        return { message: 'Item removed from cart successfully!', cart: updated };
    }
}
