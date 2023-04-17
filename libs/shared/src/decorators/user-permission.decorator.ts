import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Декоратор "достает" максимальный пермишн пользователя из реквеста и возвращает его
// Максимальный пермишн кладется в реквест внутри гарда ролей
export const UserPermission = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // console.log(`[shared][decorators][UserPermission] request: ${JSON.stringify(request)}`); <--- Будет ошибка при выводе лога так как request - рекурсивный объект
        return request.userMaxPermission;
    },  
);