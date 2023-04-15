import { Controller, UseFilters } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { DtoValidationPipe, HttpExceptionFilter, ObservableExceptionFilter, SharedService } from 'y/shared';
import { RegisterProfileDto, UpdateProfileDto } from 'y/shared/dto';
import { ProfilesService } from './profiles.service';

@Controller()
export class ProfilesController {
    constructor(
        private readonly profilesService: ProfilesService,
        private readonly sharedService: SharedService,
    ) {}

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'get-profiles' })
    async getProfiles(
        @Ctx() context: RmqContext,
    ) {
        this.sharedService.acknowledgeMessage(context);
        
        return this.profilesService.getAllProfiles();
    }

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'get-profile-by-email' })
    async getProfileByEmail(
        @Ctx() context: RmqContext,
        @Payload() email: string,
    ) {
        this.sharedService.acknowledgeMessage(context);
        console.log(`[profiles][get-profile-by-email] controller ${email}`);
        
        return this.profilesService.getProfileByEmail(email);
    }

    @UseFilters(new HttpExceptionFilter(), new ObservableExceptionFilter())
    @MessagePattern({ cmd: 'update-profile-by-email' })
    async updateProfileByEmail(
        @Ctx() context: RmqContext,
        @Payload('email') email: string,
        @Payload('dto', new DtoValidationPipe()) dto: UpdateProfileDto,
    ) {
        this.sharedService.acknowledgeMessage(context);
        // console.log(`payload email: ${JSON.stringify(email)}`)
        // console.log(`payload dto: ${JSON.stringify(dto)}`)
        return this.profilesService.updateProfileByEmail(email, dto);
    }

    @UseFilters(new HttpExceptionFilter(), new ObservableExceptionFilter())
    @MessagePattern({ cmd: 'delete-profile-by-email' })
    async deleteProfileByEmail(
        @Ctx() context: RmqContext,
        @Payload() email: string
    ) {
        this.sharedService.acknowledgeMessage(context);
        return this.profilesService.deleteProfileByEmail(email);
    }

    @UseFilters(new ObservableExceptionFilter())
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
