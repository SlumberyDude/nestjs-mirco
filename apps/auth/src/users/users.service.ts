import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddRoleDto, AddRoleDtoEmail, CreateUserDto, UpdateUserDto } from 'y/shared/dto';
import { RolesService } from '../roles/roles.service';
import { User } from './users.model';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private readonly roleService: RolesService
    ) {}

    async createUser(dto: CreateUserDto) {
        const role = await this.roleService.getRoleByName('USER');

        console.log(`[auth][users.service][createUser] role = ${JSON.stringify(role)}`);

        if (role === null) { throw new HttpException(
            "Роль 'USER' не найдена, необходимо выполнение инициализации ресурса",
            HttpStatus.I_AM_A_TEAPOT
        )}
        
        let user = await this.userRepository.create(dto);
        await user.$set('roles', [role.id]); // $set позволяет изменить объект и сразу обновить его в базе

        user.roles = [role]; // Не понимаю, почему не выходит присвоение свойства к модели роли! Вроде был в модели поле есть, да и отдаетсяя в другом эндпоинте по email вполне нормально. Непонятно.
        // console.log(`[auth][users.service][createUser] user = ${JSON.stringify(user)}`);
        return user;
    }

    async getAllUsers() {
        return await this.userRepository.findAll({ include: {all: true} });
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: {email: email}, include: {all: true} });
        return user;
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

    async addRole(dto: AddRoleDto) {
        const role = await this.roleService.getRoleByName(dto.roleName);
        const user = await this.userRepository.findByPk(dto.userId);

        if (role && user) {
            await user.$add('roles', role.id);
            return user;
        }
        
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    async addRoleByEmail(dto: AddRoleDtoEmail) {
        const role = await this.roleService.getRoleByName(dto.roleName);
        const user = await this.userRepository.findOne({ where: {email: dto.email} });

        if (role && user) {
            await user.$add('roles', role.id);
            return user;
        }
        
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }
}
