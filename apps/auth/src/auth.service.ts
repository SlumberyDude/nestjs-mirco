import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'y/shared/dto';
import { User } from './users/users.model';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';
import { HttpRpcException } from 'y/shared';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(userDto: CreateUserDto): Promise<{ token: string; }> {
        const candidate = await this.usersService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
        }
        
        const hashPassword = await bcrypt.hash(userDto.password, 5);

        const user = await this.usersService.createUser({...userDto, password: hashPassword});

        return this.generateToken(user);
    }

    async verifyJwt(jwt: string): Promise<{ exp: number }> {

        if (!jwt) {
            throw new UnauthorizedException('JWT токен не обнаружен');
        }
        console.log('JWT token in here')

        try {
            const { exp } = await this.jwtService.verifyAsync(jwt);
            console.log(`token_exp = ${exp}`);
            return { exp }; // Expiration
        } catch (error) {
            console.log(`Got error in verifyJwt: ${JSON.stringify(error)}`);    
            throw new UnauthorizedException('Невалидный JWT токен');
        }
    }

    async login(userDto: CreateUserDto) {
        console.log(`[login] userDto: ${JSON.stringify(userDto)}`)
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
        // const payload = { email: user.email, id: user.id, roles: user.roles };
        const payload = { email: user.email, id: user.id };
        return {
            token: this.jwtService.sign(payload)
        }
    }

}
