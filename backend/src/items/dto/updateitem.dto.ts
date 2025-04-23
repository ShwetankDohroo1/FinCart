import { PartialType } from '@nestjs/mapped-types';
import { AddItemDto } from './additem.dto';

export class UpdateItemDto extends PartialType(AddItemDto) {

}
