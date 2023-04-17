import { IsEmail, IsInt, IsString } from "class-validator";

export class AddRoleDto {

    @IsInt({ message: 'Должно быть числом' })
    readonly userId: number;

    @IsString({ message: 'Должно быть строкой' })
    readonly roleName: string;
}

export class AddRoleDtoEmail {

    @IsEmail({}, { message: 'Необходим email' })
    readonly email: string;

    @IsString({ message: 'Должно быть строкой' })
    readonly roleName: string;
}