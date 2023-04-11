import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'y/shared';
import { PostgresDBModule } from 'y/shared/postgresdb.module';
import { AuthController } from './auth.controller';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        SharedModule,
        PostgresDBModule,
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [],
})
export class AuthModule {}
