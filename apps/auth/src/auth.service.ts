import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'y/shared/dto';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async register(dto: CreateUserDto) {
        console.log(`Dto in authService: ${dto}`);
        // return this.usersService.createUser(dto);
        return this.usersService.createUser({email: dto.email, password: dto.password});
    }

}
