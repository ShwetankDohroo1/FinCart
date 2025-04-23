import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ItemsService{
    constructor(private prisma: PrismaService){}
    
}