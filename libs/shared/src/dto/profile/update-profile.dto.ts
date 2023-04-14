import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateProfileDto } from "./create-profile.dto";

// Обновлять можно опционально: все поля в модели профиля исключая внешний ключ на таблицу пользователя
export class UpdateProfileDto extends PartialType(OmitType(CreateProfileDto, ['user_id'] as const)) {}