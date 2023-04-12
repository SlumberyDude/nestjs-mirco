import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'y/shared/shared.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        SharedModule,
        SharedModule.registerDatabase('POSTGRES_PROFILES_HOST'),
    ],
    controllers: [ProfilesController],
    providers: [ProfilesService],
})
export class ProfilesModule {}
