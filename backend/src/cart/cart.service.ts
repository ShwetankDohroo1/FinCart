import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService){}
    //fetching cart of the user.
    async getCart(userId: number){
        return this.prisma.cart.findUnique({
            where: {userId},
            include: {items:true},
        });
    }
    //logic for adding items in the cart or creating new cart.
    async addItem(userId: number, itemId: number){
        let cart = await this.prisma.cart.findUnique({where: {userId}});
        if(!cart){
            cart = await this.prisma.cart.create({
                data:{
                    userId,
                    items:{
                        connect: {
                            id: itemId
                        }
                    },
                }
            });
        }
        else{
            await this.prisma.cart.update({
                where:{
                    userId
                },
                data:{
                    items:{
                        connect:{
                            id: itemId
                        }
                    },
                }
            });
        }
        return this.getCart(userId);
    }
    //removing items from the user's cart
    async removeItem(userId: number, itemId: number){
        const cart = await this.prisma.cart.findUnique({where:{ userId}});
        if(!cart) throw new NotFoundException('Cart was not found.');

        await this.prisma.cart.update({
            where:{
                userId
            },
            data:{
                items:{
                    connect:{
                        id: itemId
                    }
                },
            }
        });
        return this.getCart(userId);
    }
}
