import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from './users.model';
import { RolesModule } from '../roles/roles.module';
import { SharedModule } from 'y/shared';
import { UsersController } from './users.controller';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles]),
        RolesModule,
        SharedModule,
    ],
    exports: [
        UsersService, // Чтобы использовать сервис в модуле авторизации
    ]
})
export class UsersModule {}
