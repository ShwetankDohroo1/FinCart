import { Controller, Post, Get, Patch, Body, Param, Delete, Query, Req, UseGuards } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { AddItemDto, UpdateItemDto } from "./dto";
import { Request } from "express";
@Controller('items')
@UseGuards()
export class ItemController{
    
}