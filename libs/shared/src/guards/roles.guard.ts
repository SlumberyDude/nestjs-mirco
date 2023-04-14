import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { HttpRpcException } from '../exceptions/http.rpc.exception';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        console.log(`[shared][RolesGuard] start`);

        return true;
    }
}
        
    //     if (context.getType() !== 'http') {
    //         return false;
    //     }

    //     const request = context.switchToHttp().getRequest();

    //     const authHeader = request.headers['authorization'];

    //     if (!authHeader) {
    //         // console.log(`[shared][AuthGuard] Нет заголовка авторизации`);
    //         throw new UnauthorizedException('Нет заголовка авторизации');
    //     } 
        
    //     const authHeaderParts = (authHeader as string).split(' ');

    //     if (authHeaderParts.length !== 2 ) {
    //         throw new UnauthorizedException('Неверный формат заголовка авторизации');
    //     }

    //     const [, jwt] = authHeaderParts;

    //     // this.authService.send({ cmd: 'verify-jwt' }, { jwt }) // Возвращает Observable
    //     // Используем pipe для получения времени истечения токена
    //     // внутри используем т.н. Pipeable Operator. Он является чистой функцией и возвращает новый Observable

    //     return this.authService.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
    //         switchMap((value) => {
    //             const { exp } = value;
    //             if (!exp) {
    //                 // console.log(`[shared][AuthGuard] there is no {exp} from pipe`);
    //                 // return of(false); // Возвращаем false но в виде Observable
    //                 const { error } = value;
    //                 throw new UnauthorizedException(error);
    //             } 

    //             const TOKEN_EXP_MS = exp * 1000; // exp - время в секундах, конвертируем в мс

    //             const isJwtValid = Date.now() < TOKEN_EXP_MS;
    //             return of(isJwtValid);
    //         }),
    //         catchError( (error) => {
    //             // console.log(`[shared][AuthGuard] catchError error = ${JSON.stringify(error)}`)
    //             // throw new UnauthorizedException(error);
    //             if (error instanceof UnauthorizedException)
    //                 throw error;
    //             throw new UnauthorizedException('Ошибка валидации токена');
    //         })
    //     )

    //     throw new Error('Method not implemented.');
