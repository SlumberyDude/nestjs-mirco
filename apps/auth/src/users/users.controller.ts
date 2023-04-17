import { Controller, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { DtoValidationPipe, HttpExceptionFilter, ObservableExceptionFilter, SharedService, UserPermission } from 'y/shared';
import { AddRoleDtoEmail, CreateUserDto } from 'y/shared/dto';

// @UsePipes(ValidationPipe)
// @ApiTags('Пользователи')
@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService,
        private readonly sharedService: SharedService,
    ) {}

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'get-user-by-email' })
    async getUser(
        @Ctx() context: RmqContext,
        @Payload() email: string,
    ) {
        this.sharedService.acknowledgeMessage(context);
        console.log(`[auth][users.controller][getUserByEmail] email: ${JSON.stringify(email)}`);

        return await this.usersService.getUserByEmail(email);
    }

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'create-user' })
    async createUser(
        @Ctx() context: RmqContext,
        @Payload( new DtoValidationPipe() ) dto: CreateUserDto,
    ) {
        this.sharedService.acknowledgeMessage(context);
        console.log(`[auth][users.controller][createUser] +`);

        return await this.usersService.createUser(dto);
    }

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'add-role-to-user' })
    async addRole(
        @Ctx() context: RmqContext,
        @Payload( new DtoValidationPipe() ) dto: AddRoleDtoEmail,
    ) {
        this.sharedService.acknowledgeMessage(context);

        return await this.usersService.addRoleByEmail(dto);
    }

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
    // @ApiOperation({ summary: 'Выдача роли пользователю' })
    // @ApiResponse({ status: 200 })
    // // @RoleAccess(initRoles['ADMIN'].value)
    // // @UseGuards(RolesGuard)
    // @Post('/role')
    // addRole(@Body() roleDto: AddRoleDto) {
    //     return this.usersService.addRole(roleDto);
    // }

}
