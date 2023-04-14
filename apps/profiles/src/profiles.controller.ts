import { Controller, UseFilters } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { DtoValidationPipe, HttpExceptionFilter, SharedService } from 'y/shared';
import { RegisterProfileDto } from 'y/shared/dto';
import { ProfilesService } from './profiles.service';

@Controller()
export class ProfilesController {
    constructor(
        private readonly profilesService: ProfilesService,
        private readonly sharedService: SharedService,
    ) {}

    @MessagePattern({ cmd: 'get-profiles' })
    async getProfiles(@Ctx() context: RmqContext) {
        this.sharedService.acknowledgeMessage(context);
        console.log(`[profiles][get-profiles] controller`);
        
        return this.profilesService.getHello();
    }

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'register-profile' })
    async registerProfile(
        @Ctx() context: RmqContext,
        @Payload(new DtoValidationPipe()) dto: RegisterProfileDto
    ) {
        this.sharedService.acknowledgeMessage(context);
        console.log(`[profiles][register-profile] controller`);
        
        return this.profilesService.registration(dto);
    }

}
