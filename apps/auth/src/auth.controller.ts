import { Controller, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { HttpExceptionFilter, ObservableExceptionFilter, SharedService } from 'y/shared';
import { CreateUserDto } from 'y/shared/dto';
import { UsersService } from './users/users.service';
import { AuthService } from './auth.service';
import { DtoValidationPipe } from 'y/shared/pipes/dto-validation.pipe';

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

    @UseFilters(new ObservableExceptionFilter(), new HttpExceptionFilter())
    @MessagePattern({ cmd: 'register' })
    async registerUser(
        @Ctx() context: RmqContext,
        @Payload(new DtoValidationPipe()) dto: CreateUserDto
    ) {
        this.sharedService.acknowledgeMessage(context);

        console.log(`got payload dto: ${dto.email} ${dto.password}`);

        return await this.authService.register(dto);
    }

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'get-user-by-email' })
    async getUserByEmail(
        @Ctx() context: RmqContext,
        @Payload() email: string
    ) {
        this.sharedService.acknowledgeMessage(context);

        return await this.userService.getUserByEmail(email);
    }

    @MessagePattern({ cmd: 'verify-jwt'})
    @UseFilters(new HttpExceptionFilter())
    async verifyJwt(
        @Ctx() context: RmqContext,
        @Payload() payload: { jwt: string },
    ) {
        this.sharedService.acknowledgeMessage(context);
        console.log(`[auth][verify-jwt] controller.`);

        return await this.authService.verifyJwt(payload.jwt);
    }

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'login' })
    async login (
        @Ctx() context: RmqContext,
        @Payload(new DtoValidationPipe()) userDto: CreateUserDto
    ) {
        console.log(`got Dto in Login in Auth.controller: ${JSON.stringify(userDto)}`);
        this.sharedService.acknowledgeMessage(context);

        return this.authService.login(userDto);
    }

}
