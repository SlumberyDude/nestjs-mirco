import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthGuard } from './auth.guard';
import { SharedService } from './shared.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        })
    ],
    providers: [SharedService, AuthGuard],
    exports: [SharedService, AuthGuard],
})
export class SharedModule {
    static registerRmq(service: string, queue: string): DynamicModule {
        const providers = [
            {
                provide: service,
                useFactory: (configService: ConfigService) => {
                    const USER = configService.get('RABBITMQ_USER');
                    const PASSWORD = configService.get('RABBITMQ_PASS');
                    const HOST = configService.get('RABBITMQ_HOST');

                    return ClientProxyFactory.create({
                        transport: Transport.RMQ,
                        options: {
                            urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
                            queue: queue,
                            queueOptions: {
                                durable: true,
                            }
                        }
                    });
                },
                inject: [ConfigService]
            },
        ];

        return {
            module: SharedModule,
            providers,
            exports: providers,
        };
    }

    static registerDatabase(host_env: string): DynamicModule {
        const imports = [
            SequelizeModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    dialect: 'postgres',
                    host: configService.get(host_env),
                    port: +configService.get('POSTGRES_PORT'),
                    username: configService.get('POSTGRES_USER'),
                    password: configService.get('POSTGRES_PASSWORD'),
                    database: configService.get('POSTGRES_DB'),
                    autoLoadModels: true,
                    synchronize: true, // С осторожностью, на продакшене не юзать, приводит к повреждению данных
                }),
    
                inject: [ConfigService],
            }),
        ];

        return {
            module: SharedModule,
            imports,
        };
    }
}
