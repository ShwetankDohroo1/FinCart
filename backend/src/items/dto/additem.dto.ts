import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class AddItemDto{
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    image: string;
}