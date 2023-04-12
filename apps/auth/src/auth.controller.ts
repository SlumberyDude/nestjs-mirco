import { Controller, UseFilters, ValidationPipe } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { HttpExceptionFilter, ParseJsonPipe, SharedService } from 'y/shared';
import { CreateUserDto } from 'y/shared/dto';
import { UsersService } from './users/users.service';
import { AuthService } from './auth.service';
import { Transform } from 'class-transformer';

@Controller()
export class AuthController {
    constructor(
        private readonly userService: UsersService,
        private readonly sharedService: SharedService,
        private readonly authService: AuthService
    ) {}

    @MessagePattern({ cmd: 'get-users' })
    async getUser(@Ctx() context: RmqContext) {
        this.sharedService.acknowledgeMessage(context);

        return await this.userService.getAllUsers();
    }

    @MessagePattern({ cmd: 'post-user' })
    async postUser(
        @Ctx() context: RmqContext,
    ) {
        this.sharedService.acknowledgeMessage(context);
        
        return await this.userService.createUser({email: 'jenek@mail.ru', password: '123123'});
    }

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'register'})
    async registerUser(
        @Ctx() context: RmqContext,
        @Payload(new ParseJsonPipe(), new ValidationPipe()) dto: CreateUserDto
    ) {
        this.sharedService.acknowledgeMessage(context);

        console.log(`got payload dto: ${dto.email} ${dto.password}`);

        return await this.authService.register(dto);
    }
}
