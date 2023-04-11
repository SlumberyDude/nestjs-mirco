import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SharedService } from 'y/shared';
import { ProfilesModule } from './profiles.module';

async function bootstrap() {
    const app = await NestFactory.create(ProfilesModule);
    const configService = app.get(ConfigService);

    const sharedService = app.get(SharedService);

    const queue = configService.get('RABBITMQ_PROFILES_QUEUE');

    app.connectMicroservice(sharedService.getRmqOptions(queue));

    app.startAllMicroservices();
}
bootstrap();
