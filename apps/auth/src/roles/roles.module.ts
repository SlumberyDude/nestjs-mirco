import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { User } from '../users/users.model';
import { UserRoles } from './user-roles.model';
import { AuthModule } from '../auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SharedModule } from 'y/shared';

@Module({
    providers: [RolesService],
    controllers: [RolesController],
    imports: [
        SequelizeModule.forFeature([Role, User, UserRoles]),
        forwardRef( () => AuthModule ),
        SharedModule,
    ],
    exports: [
        RolesService // Добавляем, чтобы иметь возможность импортировать сервис в другой модуль, в данном случае - в модуль Users
    ]
})
export class RolesModule {}
