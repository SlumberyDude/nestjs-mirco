import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard, RolesGuard, DtoValidationPipe } from 'y/shared';
import { CreateRoleDto, CreateUserDto, EmailUserParamDto, RegisterProfileDto, UpdateProfileDto } from 'y/shared/dto';

@Controller()
export class AppController {
    constructor(
        @Inject('AUTH_SERVICE') private authService: ClientProxy,
        @Inject('PROFILES_SERVICE') private profilesService: ClientProxy,
    ) {}
    
    // AUTHORIZATION SERVICE ENDPOINTS

    // ROLES
    @UseGuards(AuthGuard, RolesGuard)
    @Post('roles/create')
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

    // AUTH

    @Post('auth/register')
    async register(
        @Body() createUserDto: CreateUserDto
    ) {
        return this.authService.send(
            {
                cmd: 'register',
            },
            createUserDto
        )
    }

    @Post('auth/login')
    async login(
        @Body() createUserDto: CreateUserDto
    ) {
        return this.authService.send(
            {
                cmd: 'login',
            },
            // JSON.stringify(createUserDto),
            createUserDto
        )
    }

    // PROFILES

    @Post('profiles/register')
    async registerProfile(
        @Body() dto: RegisterProfileDto
    ) {
        return this.profilesService.send({
            cmd: 'register-profile',
            }, dto,
        );
    }

    @UseGuards(AuthGuard)
    @Get('profiles')
    async getProfiles() {
        return this.profilesService.send({
            cmd: 'get-profiles',
        },
        {});
    }

    @UseGuards(AuthGuard)
    @Get('profiles/:email')
    async getProfileByEmail(
        @Param(new DtoValidationPipe()) {email}: EmailUserParamDto
    ) {
        return this.profilesService.send({
            cmd: 'get-profile-by-id',
            }, email
        );
    }

    @UseGuards(AuthGuard)
    @Post('profiles/update')
    async updateProfile(
        @Body() dto: UpdateProfileDto
    ) {
        return this.profilesService.send({
            cmd: 'update-profile',
            }, dto,
        );
    }


    @Get('auth')
    async getUsers() {
        return this.authService.send({
            cmd: 'get-users',
        },
        {});
    }

    @Post('auth')
    async postUser() {
        return this.authService.send(
            {
                cmd: 'post-user',
            },
            {},
        )
    }



    



}
