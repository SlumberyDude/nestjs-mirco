import { Module } from '@nestjs/common';
import { SharedModule } from 'y/shared/shared.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
    imports: [
        SharedModule
    ],
    controllers: [ProfilesController],
    providers: [ProfilesService],
})
export class ProfilesModule {}
