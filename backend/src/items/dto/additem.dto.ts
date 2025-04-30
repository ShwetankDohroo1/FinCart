import { IsString, IsNumber, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class AddItemDto{
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Type(() => Number)
    price: number;
}