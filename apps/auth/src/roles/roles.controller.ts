import { Controller, UseFilters } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { HttpExceptionFilter, SharedService } from "y/shared";
import { CreateRoleDto } from "y/shared/dto";
import { DtoValidationPipe } from "y/shared/pipes/dto-validation.pipe";
import { RolesService } from "./roles.service";

@Controller('roles')
export class RolesController {

    constructor(
        private readonly rolesService: RolesService,
        private readonly sharedService: SharedService,
    ) {}

    
    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'create-role' })
    async getUser(
        @Ctx() context: RmqContext,
        @Payload(new DtoValidationPipe()) dto: CreateRoleDto
    ) {
        this.sharedService.acknowledgeMessage(context);
        console.log(`[roles.controller][create-dto] dto: ${JSON.stringify(dto)}`);

        return await this.rolesService.createRole(dto);
    }

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'get-role-by-name' })
    getByName(
        @Ctx() context: RmqContext,
        @Payload() roleName: string
    ) {
        return this.rolesService.getRoleByName(roleName);
    }

    @UseFilters(new HttpExceptionFilter())
    @MessagePattern({ cmd: 'get-all-roles' })
    getAllRoles() {
        return this.rolesService.getAllRoles();
    }

    // @UseFilters(new HttpExceptionFilter())
    // @MessagePattern({ cmd: 'delete-role-by-name' })
    // deleteByName(
    //     @Ctx() context: RmqContext,
    //     @Payload() roleName: string
    // ): Promise<void> {
    //     return this.rolesService.deleteByName(name, userPerm);
    // }


    // @UsePipes(ValidationPipe)
    // @RoleAccess(initRoles['ADMIN'].value)
    // @UseGuards(RolesGuard)
    // @Put('/:name')
    // updateRole(@Param(new ValidationPipe()) {name: name}: UpdateRoleParamDto,
    //            @Body() updateDto: UpdateRoleDto,
    //            @UserMaxPermission() userPerm: number
    // ) {
    //     return this.roleService.updateByName(name, updateDto, userPerm);
    // }
}
