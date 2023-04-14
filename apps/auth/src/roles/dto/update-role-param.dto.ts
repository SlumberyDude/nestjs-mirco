import { PickType } from "@nestjs/swagger";
import { DeleteRoleDto } from "./delete-role.dto";

export class UpdateRoleParamDto extends PickType(DeleteRoleDto, ['name'] as const) {}