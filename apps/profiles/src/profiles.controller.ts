import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from 'y/shared';
import { ProfilesService } from './profiles.service';

@Controller()
export class ProfilesController {
    constructor(
        private readonly profilesService: ProfilesService,
        private readonly sharedService: SharedService
    ) {}

    @MessagePattern({ cmd: 'get-profiles' })
    async getUser(@Ctx() context: RmqContext) {
        this.sharedService.acknowledgeMessage(context);

        return this.profilesService.getHello();
    }

}
