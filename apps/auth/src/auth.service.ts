import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'y/shared/dto';
import { User } from './users/users.model';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';
import { HttpRpcException } from 'y/shared';
import { Role } from './roles/roles.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(userDto: CreateUserDto): Promise<{ id: number; }> {
        const candidate = await this.usersService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpRpcException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
        }
        
        const hashPassword = await bcrypt.hash(userDto.password, 5);

        const user = await this.usersService.createUser({...userDto, password: hashPassword});

        return { id: user.id };
    }

    async verifyJwt(jwt: string): Promise<{ exp: number, email: string, roles: Role[] }> {

        if (!jwt) {
            throw new UnauthorizedException('JWT токен не обнаружен');
        }

        try {
            const { exp, email, roles } = await this.jwtService.verifyAsync(jwt) as {exp: number, email: string, roles: Role[]};
            // console.log(`[auth][auth.service][verifyJwt] payload exp = ${JSON.stringify(exp)}`);
            // console.log(`[auth][auth.service][verifyJwt] payload roles = ${JSON.stringify(roles)}`);
            return { exp, email, roles };
        } catch (error) {  
            throw new UnauthorizedException('Невалидный JWT токен');
        }
    }

    async login(userDto: CreateUserDto) {
        // console.log(`[login] userDto: ${JSON.stringify(userDto)}`)
        const user = await this.validateUser(userDto);
        return this.generateToken(user);  
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user ? user.password: '');
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный email или пароль'});
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.roles };
        // const payload = { email: user.email, id: user.id };
        return {
            token: this.jwtService.sign(payload)
        }
    }

}
