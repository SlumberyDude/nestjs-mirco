import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    getHello(): string {
        return this.authService.getHello();
    }

    @MessagePattern({ cmd: 'get-user' })
    async getUser(@Ctx() context: RmqContext) {
        const channel = context.getChannelRef(); // Позволяет нам получить определенные сообщения из контекста
        const message = context.getMessage();
        channel.ack(message); // Извещаем брокер о получении сообщения (?)

        return { user: 'USER' };
    }
}
