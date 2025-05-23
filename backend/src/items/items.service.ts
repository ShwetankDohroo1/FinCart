import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AddItemDto, UpdateItemDto } from "./dto";
@Injectable()
export class ItemsService {
    constructor(private prisma: PrismaService) { }
    create(userId: number, dto: AddItemDto, imageUrl: string) {
        return this.prisma.item.create({
            data: {
                ...dto,
                image: imageUrl,
                ownerId: userId,
            },
        })
    }
    findAll(query?: string, filter?: string) {
        return this.prisma.item.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image: true,
                owner: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }
    findMyItems(userId: number) {
        return this.prisma.item.findMany({
            where: {
                ownerId: userId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image: true,
                owner: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }
    update(id: number, userId: number, dto: UpdateItemDto) {
        return this.prisma.item.updateMany({
            where: {
                id,
                ownerId: userId
            },
            data: dto,
        })
    }
    remove(id: number, userId: number) {
        return this.prisma.item.deleteMany({
            where: {
                id,
                ownerId: userId
            }
        });
    }
}