import { PartialType, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "y/shared/dto";

export class UpdateUserDto extends PartialType(PickType(CreateUserDto, ['email'] as const)) {}