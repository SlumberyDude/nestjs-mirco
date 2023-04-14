import { IntersectionType, OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "../user/create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateProfileDto {

    @ApiProperty({ example: 'Ubivashka666', description: 'Никнейм' })
    @IsString({ message: 'Должно быть строкой' })
    @IsOptional()
    readonly username: string;

    @ApiProperty({ example: 'https://twitter.com/elonmusk', description: 'Ссылка на страницу в социальной сети' })
    @IsUrl({}, {message: "Значение не является URL"})
    @IsOptional()
    readonly social: string;

    @ApiProperty({ example: '2', description: 'Внешний ключ пользователя данного профиля' })
    @IsInt({message: "Значение не является целым"})
    readonly user_id: number;
}

export class RegisterProfileDto extends IntersectionType(
    CreateUserDto,
    OmitType(CreateProfileDto, ['user_id'] as const)
) {}