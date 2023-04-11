import { Body, Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from 'y/shared';
import { CreateUserDto } from './users/dto/create.user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AuthController {
    constructor(
        private readonly userService: UsersService,
        private readonly sharedService: SharedService,
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
}
