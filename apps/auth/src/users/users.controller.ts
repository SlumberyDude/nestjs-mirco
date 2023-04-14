import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddRoleDto } from './dto/add-role.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
import { initRoles } from '../init/init.roles';
import { UpdateUserDto } from './dto/update.user.dto';
// import { RoleAccess } from '../auth/roles.decorator';
// import { RolesGuard } from '../roles.guard';
import { EmailUserParamDto } from './dto/email.user.param.dto';

// @UsePipes(ValidationPipe)
// @ApiTags('Пользователи')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

/*
    @ApiOperation({ summary: 'Получение всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    // @RoleAccess(initRoles['ADMIN'].value) // Минимально необходимая роль (с минимальным уровнем прав доступа) 10 - ADMIN по умолчанию
    // @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({ summary: 'Получение пользователя по email' })
    @ApiResponse({ status: 200, type: User })
    // @RoleAccess({minRoleVal: initRoles['ADMIN'].value, allowSelf: true})
    // @UseGuards(RolesGuard)
    @Get('/:email')
    getUserByEmail(@Param(new ValidationPipe()) {email}: EmailUserParamDto) {
        console.log(`get email ${email}`)
        return this.usersService.getUserByEmail(email);
    }

    @ApiOperation({ summary: 'Изменение пользователя по email' })
    @ApiResponse({ status: 200, type: User })
    @RoleAccess({minRoleVal: initRoles.OWNER.value + 1, allowSelf: true}) // Никто кроме самого пользователя не может менять свой email
    @UseGuards(RolesGuard)
    @Put('/:email')
    updateUser(
        @Body() dto: UpdateUserDto,
        @Param(new ValidationPipe()) {email}: EmailUserParamDto,
    ) {
        return this.usersService.updateUserByEmail(email, dto);
    }

    @ApiOperation({ summary: 'Удаление пользователя по email' })
    @ApiResponse({ status: 200, type: User })
    @RoleAccess({minRoleVal: initRoles.OWNER.value + 1, allowSelf: true}) // Никто кроме самого пользователя не может удалить свой аккаунт
    @UseGuards(RolesGuard)
    @Delete('/:email')
    deleteUser(
        @Param(new ValidationPipe()) {email}: EmailUserParamDto,
    ) {
        return this.usersService.deleteUserByEmail(email);
    }
*/
    @ApiOperation({ summary: 'Выдача роли пользователю' })
    @ApiResponse({ status: 200 })
    // @RoleAccess(initRoles['ADMIN'].value)
    // @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() roleDto: AddRoleDto) {
        return this.usersService.addRole(roleDto);
    }

}
