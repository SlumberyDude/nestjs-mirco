import { ApiProperty } from "@nestjs/swagger";
import { IsNotIn, IsString } from "class-validator";
import { initRoles } from "../../init/init.roles";

export class DeleteRoleDto {
    @ApiProperty({ example: 'SMALLADMIN', description: 'Имя роли' })
    @IsString({message: 'Должно быть строкой'})
    @IsNotIn(Object.values(initRoles).map( role => role.name), {message: 'Попытка операции над базовой ролью'})
    readonly name: string;
}