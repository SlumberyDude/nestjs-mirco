import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { initRoles, RoleAccess, RolesGuard, UserPermission } from 'y/shared';
import { AddRoleDtoEmail, CreateUserDto } from 'y/shared/dto';

@Controller('users')
export class UsersController {

    constructor(
        @Inject('AUTH_SERVICE') private authService: ClientProxy,
    ) {}

    @Post()
    async createUser(
        @Body() dto: CreateUserDto
    ) {
        return this.authService.send(
            {
                cmd: 'create-user',
            },
            dto,
        )
    }

    @RoleAccess({minRoleVal: initRoles.ADMIN.value, allowSelf: true})
    @UseGuards(RolesGuard)
    @Get('/:email')
    async getUserByEmail(
        @Param('email') email: string, // Важно добавить 'email' в аргумент так как в пейлоад приходит простой советский трехкопеечный объект {'email': 'user@mail.ru'} а не строка
    ) {
        return this.authService.send(
            {
                cmd: 'get-user-by-email',
            },
            email,
        )
    }

    @RoleAccess(initRoles.ADMIN.value)
    @UseGuards(RolesGuard)
    @Post('/add_role')
    async addRole(
        @Body() addRoleDto: AddRoleDtoEmail
    ) {
        return this.authService.send(
            {
                cmd: 'add-role-to-user',
            },
            addRoleDto,
        )
    }

}
