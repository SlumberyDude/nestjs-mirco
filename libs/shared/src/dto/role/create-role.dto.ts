import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsInt, IsString } from "class-validator";

export class CreateRoleDto {
    
    @ApiProperty({ example: 'USER', description: 'Имя роли' })
    @IsString({message: 'Должно быть строкой'})
    @IsAlpha(undefined, {message: 'Для названия роли используются только латинские буквы'})
    readonly name: string;

    @ApiProperty({ example: '1', description: 'Уровень доступа роли' })
    @IsInt({message: 'Должно быть целым числом'})
    readonly value: number;

    @ApiProperty({ example: 'Роль для рядовых пользователей', description: 'Описание роли' })
    @IsString({message: 'Должно быть строкой'})
    readonly description: string;
}