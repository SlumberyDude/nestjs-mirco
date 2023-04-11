import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'y/shared';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
