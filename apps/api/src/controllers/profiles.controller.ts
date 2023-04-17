import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DtoValidationPipe, initRoles, RoleAccess, RolesGuard } from 'y/shared';
import { EmailUserParamDto, RegisterProfileDto, UpdateProfileDto } from 'y/shared/dto';

@Controller('profiles')
export class ProfilesController {

    constructor(
        @Inject('PROFILES_SERVICE') private profilesService: ClientProxy,
    ) {}

    @Post('register')
    async registerProfile(
        @Body() dto: RegisterProfileDto
    ) {
        return this.profilesService.send({
            cmd: 'register-profile',
            }, dto,
        );
    }

    @RoleAccess({minRoleVal: initRoles.ADMIN.value, allowSelf: true})
    @UseGuards(RolesGuard)
    @Get()
    async getProfiles() {
        return this.profilesService.send({
            cmd: 'get-profiles',
        },
        {});
    }

    @RoleAccess({minRoleVal: initRoles.ADMIN.value, allowSelf: true})
    @UseGuards(RolesGuard)
    @Get(':email')
    async getProfileByEmail(
        @Param(new DtoValidationPipe()) {email}: EmailUserParamDto
    ) {
        return this.profilesService.send({
            cmd: 'get-profile-by-email',
            }, email
        );
    }

    @RoleAccess({minRoleVal: initRoles.ADMIN.value, allowSelf: true})
    @UseGuards(RolesGuard)
    @Delete(':email')
    async deleteProfileByEmail(
        @Param(new DtoValidationPipe()) {email}: EmailUserParamDto
    ) {
        return this.profilesService.send({
            cmd: 'delete-profile-by-email',
            }, email
        );
    }

    @RoleAccess({minRoleVal: initRoles.ADMIN.value, allowSelf: true})
    @UseGuards(RolesGuard)
    @Put(':email')
    async updateProfile(
        @Param('email') email: string,
        @Body() dto: UpdateProfileDto
    ) {
        console.log(JSON.stringify(dto), JSON.stringify(email))
        return this.profilesService.send({
            cmd: 'update-profile-by-email',
            }, {email: email, dto: dto},
        );
    }
}
