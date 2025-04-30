import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { Roles } from "src/common/decorator/role.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";

@Controller('users')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('ADMIN')
export class UseController{
    constructor(private readonly userService: UserService){}

    @Get('customers')
    getCustomer(){
        return this.userService.getAllCustomers();
    }

    @Get('retailers')
    getRetailers(){
        return this.userService.getAllRetailers();
    }

    @Get('admin')
    getAdmin(){
        return this.userService.getAllAdmins();
    }

    @Delete(':id')
    deleteUser(@Param('id') id:string){
        return this.userService.deleteUser(+id);
    }
}