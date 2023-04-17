import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'y/shared/dto';

@Controller('init')
export class InitController {

    constructor(
        @Inject('AUTH_SERVICE') private authService: ClientProxy,
    ) {}

    @Post()
    async initServer(
        @Body() dto: CreateUserDto
    ) {
        return this.authService.send(
            {
                cmd: 'init-server',
            },
            dto,
        )
    }
}
