import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { RoleDecoratorParams, ROLES_KEY } from '../decorators/roles.decorator';
import { HttpRpcException } from '../exceptions/http.rpc.exception';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // console.log(`[shared][AuthGuard] start`);

        if (context.getType() !== 'http') {
            return false;
        }

        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Нет заголовка авторизации');
        } 
        
        const authHeaderParts = (authHeader as string).split(' ');

        if (authHeaderParts.length !== 2 ) {
            throw new UnauthorizedException('Неверный формат заголовка авторизации');
        }

        const [, jwt] = authHeaderParts;

        return this.authService.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
            switchMap((value) => {
                const { exp, email, roles } = value as { exp: number, email: string, roles: Array<any>};
                if (!exp) {
                    const { error } = value;
                    throw new UnauthorizedException(error);
                } 

                const TOKEN_EXP_MS = exp * 1000; // exp - время в секундах, конвертируем в мс

                const isJwtValid = Date.now() < TOKEN_EXP_MS;
                if (!isJwtValid) {
                    throw new UnauthorizedException('Токен истек');
                }

                // Проверяем роли. Необходимость роли находится в метаданных гарда
                // Пытаемся достать метаданные из заголовка     
                let roleParams = this.reflector.get<RoleDecoratorParams>(
                    ROLES_KEY,
                    context.getHandler(),
                )
                // Затем из класса
                if (!roleParams) {
                    roleParams = this.reflector.get<RoleDecoratorParams>(
                        ROLES_KEY,
                        context.getClass(),
                    )
                }
                console.log(`[shared][roles.guard] roleParams in meta: ${JSON.stringify(roleParams)}`);
                // Если их нет, то гард проходит проверку (авторизация уже прошла)
                if (!roleParams) return of(true);

                // Теперь используем объект пользователя для проверки ролей
                console.log(`[shared][roles.guard] request.params: ${JSON.stringify(request.params)}`)
                
                if (roleParams.allowSelf && request.params['email'] == email) return of(true);

                // Считаем максимальный уровень доступа для пользователя (записываем его в реквест чтобы можно было в декораторе достать)
                request.userMaxPermission = Math.max(...roles.map( role => role.value ));

                if (request.userMaxPermission >= roleParams.minRoleVal) return of(true);

                // если с ролями не получилось, то выкидываем ошибку, которая будет сразу поймана парой строк дальше
                throw new UnauthorizedException('Недостаточно прав')
            }),
            catchError( (error) => {
                if (error instanceof UnauthorizedException)
                    throw error;
                throw new UnauthorizedException('Ошибка валидации токена');
            })
        );
    }
}