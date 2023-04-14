import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from './users.model';
import { RolesModule } from '../roles/roles.module';

@Module({
    controllers: [],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User]),
        RolesModule,
    ],
    exports: [
        UsersService, // Чтобы использовать сервис в модуле авторизации
    ]
})
export class UsersModule {}
