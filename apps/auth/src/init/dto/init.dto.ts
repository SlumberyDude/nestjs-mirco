import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class InitDto {

    @ApiProperty({ example: 'Adm1nPa$$word', description: 'Пароль администратора' })
    @IsStrongPassword(
        {minLength: 6, minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 1},
        {message: 'Пароль должен иметь минимальную длину 6 символов, иметь минимум 1 строчную букву, 1 заглавную, 1 цифру и 1 спецсимвол'}
    )
    @IsString({message: 'Поле должно быть строкой'})
    password: string;

    @ApiProperty({ example: 'admin666@mail.ru', description: 'Почта администратора' })
    @IsEmail({}, {message: 'Должно быть почтовым адресом'})
    email: string;
}