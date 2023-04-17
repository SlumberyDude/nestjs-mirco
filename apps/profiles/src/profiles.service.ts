import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { catchError, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { CreateProfileDto, RegisterProfileDto, UpdateProfileDto } from 'y/shared/dto';
import { Profile } from './profiles.model';
import { ReturnProfile } from './types';

@Injectable()
export class ProfilesService {

    constructor(
        @InjectModel(Profile) private profileRepository: typeof Profile,
        @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    ) {}

    async registration(registerProfileDto: RegisterProfileDto) {
        console.log(`[profiles][registration] service. registerProfileDto: \n${JSON.stringify(registerProfileDto)}`);
        
        const id$ = this.authService.send({ cmd: 'register' }, registerProfileDto).pipe(
            switchMap((value) => {
                // console.log(`[profiles][registration] service. return from authService: ${JSON.stringify(value)}`);
                const { id } = value;
                // console.log(`id = ${id}`);
                return of(id)
            }),
            catchError( (error) => {
                console.log(`[profiles][registration] catchError error = ${JSON.stringify(error)}`)
                throw new UnauthorizedException(error);
            })
        )

        const id = await firstValueFrom(id$);

        return await this.profileRepository.create({...registerProfileDto, user_id: id});
    }

    async getAllProfiles() {
        return await this.profileRepository.findAll();
    }

    private async findUser(email: string): Promise<{id: number, email: string}> {

        const user$ = this.authService.send({ cmd: 'get-user-by-email' }, email).pipe(
            switchMap((user) => {
                const { id } = user;
                if (!id) {
                    throw new UnauthorizedException(user);
                }
                return of(user)
            }),
            catchError( (error) => {
                throw new UnauthorizedException(error);
            })
        )

        return await firstValueFrom(user$);
    } 

    async getProfileByEmail(aemail: string): Promise<ReturnProfile> {
        console.log(`[profiles][profiles.service][getProfileByEmail] email: ${aemail}`);
        const user = await this.findUser(aemail);

        const profile = await this.profileRepository.findOne({
            where: {user_id: user.id}
        });

        return {
            ...profile.dataValues,
            email: user.email,
        }
    }

    async updateProfileByEmail(email: string, updateProfileDto: UpdateProfileDto) {
        const {id} = await this.findUser(email);
        const profile = await this.profileRepository.findOne({
            where: {user_id: id}
        });
        
        await profile.update(updateProfileDto);
        return profile
    }

    async deleteProfileByEmail(email: string) {
        const {id} = await this.findUser(email);

        const profile = await this.profileRepository.findOne({ where: {user_id: id} });

        await profile.destroy();
        // Пользователя не удаляем при этом
        // await this.userService.deleteUserByEmail(email); 
    }

}
