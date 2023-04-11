import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";


export class CreateUserDto {

    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @IsString({ message: 'Должно быть строкой' })
    @IsEmail({}, {message: 'Передан некорректный email'})
    readonly email: string;

    @ApiProperty({ example: '4815162342', description: 'Пароль' })
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Длина пароля от 4 до 16 символов'})
    readonly password: string;
}