import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedModule } from 'y/shared';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InitModule } from './init/init.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService]
        }),
        SharedModule,
        // SequelizeModule.forRootAsync({
        //     useFactory: () => ({
        //         dialect: 'sqlite',
        //         storage: ':memory:',
        //         autoLoadModels: true,
        //         logging: false,
        //     }),
        // }),
        SharedModule.registerDatabase('POSTGRES_AUTH_HOST'),
        UsersModule,
        RolesModule,
        forwardRef(() => InitModule),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService] // for init
})
export class AuthModule {}
