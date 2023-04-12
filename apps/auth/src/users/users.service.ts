import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from 'y/shared/dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(dto: CreateUserDto) {
        console.log(`Dto in usersService: ${dto}`);
        const user = await this.userRepository.create(dto);
        console.log(`got user: ${user}`);
        return user;
    }

    async getAllUsers() {
        return await this.userRepository.findAll({ include: {all: true} });
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({ where: {email: email}, include: {all: true} });
    }

    async updateUserByEmail(email: string, dto: UpdateUserDto) {
        const user = await this.userRepository.findOne({where: {email}});

        if (!user) {
            throw new HttpException(`Пользователя с email ${email} не существует`, HttpStatus.NOT_FOUND);
        }

        await user.update(dto);
        return user;
    }

    async deleteUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}});

        if (!user) {
            throw new HttpException(`Пользователя с email ${email} не существует`, HttpStatus.NOT_FOUND);
        }

        await user.destroy();
    }
}
