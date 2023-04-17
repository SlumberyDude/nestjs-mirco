import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'y/shared';
import { AppController } from './app.controller';
import { ProfilesController } from './controllers/profiles.controller';
import { RolesController } from './controllers/roles.controller';
import { UsersController } from './controllers/users.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        SharedModule,
        SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
        SharedModule.registerRmq('PROFILES_SERVICE', process.env.RABBITMQ_PROFILES_QUEUE),
    ],
    controllers: [AppController, RolesController, UsersController, ProfilesController],
})
export class AppModule {}
