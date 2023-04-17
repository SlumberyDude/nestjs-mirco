import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'y/shared';
import { AuthModule } from '../auth.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { InitController } from './init.controller';
import { InitService } from './init.service';

@Module({
    controllers: [InitController],
    providers: [InitService],
    imports: [
        SharedModule,
        forwardRef(() => AuthModule), // для регистрации владельца ресурса
        RolesModule, // для создания и проверки ролей

        UsersModule, // для addRole
        JwtModule // для получения id пользователя без необходимости менять метод регистрации
    ],
    exports: []
})
export class InitModule {}
