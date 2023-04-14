import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { catchError, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { CreateProfileDto, RegisterProfileDto } from 'y/shared/dto';
import { Profile } from './profiles.model';

@Injectable()
export class ProfilesService {

    constructor(
        @InjectModel(Profile) private profileRepository: typeof Profile,
        @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    ) {}


    getHello(): string {
        return 'Hello World!';
    }

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

    // async getAllProfiles() {
    // return await this.profileRepository.findAll({
    // include: {all: true, nested: true},
    // });
    // }

    // async getProfileByEmail(email: string) {
    // const user = await this.userService.getUserByEmail(email);

    // if (!user) {
    // throw new HttpException(`Нет пользователя с email ${email}`, HttpStatus.NOT_FOUND);
    // }

    // return await this.profileRepository.findOne({
    // where: {user_id: user.id}, 
    // include: {all: true, nested: true},
    // });
    // }

    // async updateProfileByEmail(email: string, updateProfileDto: UpdateProfileDto) {
    // const profile = await this.getProfileByEmail(email);
    // await profile.update(updateProfileDto);
    // return profile
    // }

    // async deleteProfileByEmail(email: string) {
    // const user = await this.userService.getUserByEmail(email);

    // if (!user) return;

    // const profile = await this.profileRepository.findOne({ where: {user_id: user.id} });

    // await profile.destroy();

    // await this.userService.deleteUserByEmail(email);
    // }

}
