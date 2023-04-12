import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService, AuthGuard } from 'y/shared';
import { ProfilesService } from './profiles.service';

@Controller()
export class ProfilesController {
    constructor(
        private readonly profilesService: ProfilesService,
        private readonly sharedService: SharedService,
        // TEMPORARY
        private readonly authGuard: AuthGuard
    ) {}

    @MessagePattern({ cmd: 'get-profiles' })
    async getUser(@Ctx() context: RmqContext) {
        this.sharedService.acknowledgeMessage(context);

        // TEMPORARY
        console.log(123, this.authGuard.hasJwt());
        
        return this.profilesService.getHello();
    }

}
