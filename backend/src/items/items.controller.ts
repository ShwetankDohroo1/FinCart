import { Controller, Post, Get, Patch, Body, Param, Delete, Query, Req, UseGuards } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { AddItemDto, UpdateItemDto } from "./dto";
import { RequestWithUser } from "src/common/interfaces/request-with-user.interface";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemController {
    constructor(private readonly itemService: ItemsService) { }
    @Post()
    create(@Body() dto: AddItemDto, @Req() req: RequestWithUser) {
        return this.itemService.create(req.user['sub'], dto);
    }
    @Get()
    findAll(@Query('search') search: string, @Query('filter') filter: string) {
        return this.itemService.findAll(search, filter);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateItemDto, @Req() req: RequestWithUser) {
        return this.itemService.update(+id, req.user['sub'], dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: RequestWithUser) {
        return this.itemService.remove(+id, req.user['sub']);
    }
}