import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "y/shared/dto";

export class EmailUserParamDto extends PickType(CreateUserDto, ['email'] as const) {}