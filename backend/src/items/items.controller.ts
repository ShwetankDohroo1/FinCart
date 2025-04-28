import { Controller, Post, Get, Patch, Body, Param, Delete, Query, Req, UseGuards } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { AddItemDto, UpdateItemDto } from "./dto";
import { RequestWithUser } from "src/common/interfaces/request-with-user.interface";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { Roles } from "src/common/decorator/role.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { ImageGuard } from "src/common/guards/image.guard";


@Controller('items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ItemController {
    constructor(private readonly itemService: ItemsService) { }

    @Post()
    @Roles('ADMIN', 'RETAILER')
    @UseGuards(ImageGuard)
    create(@Body() dto: AddItemDto, @Req() req: RequestWithUser) {
        return this.itemService.create(req.user['sub'], dto);
    }

    @Get()
    findAll(@Query('search') search: string, @Query('filter') filter: string) {
        return this.itemService.findAll(search, filter);
    }

    @Patch(':id')
    @Roles('ADMIN', 'RETAILER')
    update(@Param('id') id: string, @Body() dto: UpdateItemDto, @Req() req: RequestWithUser) {
        return this.itemService.update(+id, req.user['sub'], dto);
    }

    @Delete(':id')
    @Roles('ADMIN', 'RETAILER')
    remove(@Param('id') id: string, @Req() req: RequestWithUser) {
        return this.itemService.remove(+id, req.user['sub']);
    }
    
    @Get('retailer')
    @Roles('RETAILER')
    findMyItems(@Req() req: RequestWithUser) {
        return this.itemService.findMyItems(req.user['sub']);
    }

}