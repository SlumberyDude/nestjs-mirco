import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedModule } from 'y/shared/shared.module';
import { ProfilesController } from './profiles.controller';
import { Profile } from './profiles.model';
import { ProfilesService } from './profiles.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        SequelizeModule.forFeature([Profile]),
        SharedModule,
        SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
        SharedModule.registerDatabase('POSTGRES_PROFILES_HOST'),
    ],
    controllers: [ProfilesController],
    providers: [ProfilesService],
})
export class ProfilesModule {}
