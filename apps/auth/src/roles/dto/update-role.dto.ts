import { PartialType } from "@nestjs/swagger";
import { CreateRoleDto } from "y/shared/dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}