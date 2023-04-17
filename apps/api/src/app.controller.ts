import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard, RolesGuard, DtoValidationPipe, HttpExceptionFilter, ObservableExceptionFilter, RoleAccess } from 'y/shared';
import { AddRoleDto, AddRoleDtoEmail, CreateRoleDto, CreateUserDto, EmailUserParamDto, RegisterProfileDto, UpdateProfileDto } from 'y/shared/dto';

@Controller()
export class AppController {
    constructor(
        @Inject('AUTH_SERVICE') private authService: ClientProxy,
    ) {}

    @Post('auth/login')
    async login(
        @Body() createUserDto: CreateUserDto
    ) {
        return this.authService.send(
            {
                cmd: 'login',
            },
            createUserDto
        )
    }
}
