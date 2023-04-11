import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
    constructor(
        @Inject('AUTH_SERVICE') private authService: ClientProxy,
        // @Inject('PROFILES_SERVICE') private profilesService: ClientProxy,
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

    // @Get('profiles')
    // async getProfiles() {
    //     return this.profilesService.send({
    //         cmd: 'get-profiless',
    //     },
    //     {});
    // }
}
