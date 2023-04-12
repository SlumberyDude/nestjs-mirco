import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'y/shared/dto';

@Controller()
export class AppController {
    constructor(
        @Inject('AUTH_SERVICE') private authService: ClientProxy,
        @Inject('PROFILES_SERVICE') private profilesService: ClientProxy,
    ) {}
    
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

    @Get('profiles')
    async getProfiles() {
        return this.profilesService.send({
            cmd: 'get-profiles',
        },
        {});
    }

    @Post('auth/register')
    async register(
        @Body() createUserDto: CreateUserDto
    ) {
        console.log(`got dto: ${createUserDto}`);
        return this.authService.send(
            {
                cmd: 'register',
            },
            JSON.stringify(createUserDto)
        )
    }
}
