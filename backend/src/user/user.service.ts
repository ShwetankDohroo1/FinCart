import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserService{
    constructor(private prisma:PrismaService){}

    getAllCustomers(){
        return this.prisma.user.findMany({
            where:{role:'CUSTOMER'},
            select:{id:true, name:true, email:true},
        });
    }

    getAllRetailers(){
        return this.prisma.user.findMany({
            where:{role:'RETAILER'},
            select:{id:true, name:true, email:true},
        });
    }

    getAllAdmins(){
        return this.prisma.user.findMany({
            where:{role:'ADMIN'},
            select:{id:true, name:true, email:true},
        });
    }
    
    deleteUser(id: number){
        return this.prisma.user.delete({
            where:{id},
        })
    }
}