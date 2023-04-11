import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SharedModule } from 'y/shared';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        // SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
        // SharedModule.registerRmq('PROFILES_SERVICE', process.env.RABBITMQ_PROFILES_QUEUE),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: 'AUTH_SERVICE',
            useFactory: (configService: ConfigService) => {
                const USER = configService.get('RABBITMQ_USER');
                const PASSWORD = configService.get('RABBITMQ_PASS');
                const HOST = configService.get('RABBITMQ_HOST');

                return ClientProxyFactory.create({
                    transport: Transport.RMQ,
                    options: {
                        urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
                        queue: process.env.RABBITMQ_AUTH_QUEUE,
                        queueOptions: {
                            durable: true,
                        }
                    }
                });
            },
            inject: [ConfigService]
        }
    
    ],
})
export class AppModule {}
