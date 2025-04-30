// src/items/items.controller.ts
import { Controller, Post, Get, Patch, Delete, Query, Param, Body, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { ItemsService } from './items.service';
import { AddItemDto, UpdateItemDto } from './dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CloudinaryService } from 'nestjs-cloudinary';

@Controller('items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ItemsController {
    constructor(private readonly itemsService: ItemsService, private readonly cloudinaryService: CloudinaryService) { }

    @Post()
    @Roles('ADMIN', 'RETAILER')
    @UseInterceptors(FileInterceptor('image'))
    async create( @UploadedFile() file: Express.Multer.File, @Body() dto: AddItemDto, @Req() req: RequestWithUser,) {
        if (!file) {
            throw new BadRequestException('Image is required');
        }
        const { secure_url } = await this.cloudinaryService.uploadFile(file, {
            folder: 'uploads',
        });

        return this.itemsService.create(req.user.sub, dto, secure_url);
    }

    @Get()
    findAll(
        @Query('search') search?: string,
        @Query('filter') filter?: string,
    ) {
        return this.itemsService.findAll(search, filter);
    }

    @Patch(':id')
    @Roles('ADMIN', 'RETAILER')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateItemDto,
        @Req() req: RequestWithUser,
    ) {
        return this.itemsService.update(+id, req.user.sub, dto);
    }

    @Delete(':id')
    @Roles('ADMIN', 'RETAILER')
    remove(
        @Param('id') id: string,
        @Req() req: RequestWithUser,
    ) {
        return this.itemsService.remove(+id, req.user.sub);
    }

    @Get('retailer')
    @Roles('RETAILER')
    findMyItems(@Req() req: RequestWithUser) {
        return this.itemsService.findMyItems(req.user.sub);
    }
}
