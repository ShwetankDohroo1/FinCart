import { IsString, IsNumber } from "class-validator";

export class AddItemDto{
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;
}