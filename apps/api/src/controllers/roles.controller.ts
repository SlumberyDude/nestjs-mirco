import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RolesGuard } from 'y/shared';
import { CreateRoleDto } from 'y/shared/dto';

@Controller('roles')
export class RolesController {

    constructor(
        @Inject('AUTH_SERVICE') private authService: ClientProxy,
    ) {}

    @UseGuards(RolesGuard)
    @Post('create')
    async createRole(
        @Body() createRoleDto: CreateRoleDto
    ) {
        return this.authService.send(
            {
                cmd: 'create-role',
            },
            createRoleDto,
        )
    }

    @Get()
    async getAllRoles() {
        return this.authService.send(
            {
                cmd: 'get-all-roles',
            },
            {},
        )
    }
}
