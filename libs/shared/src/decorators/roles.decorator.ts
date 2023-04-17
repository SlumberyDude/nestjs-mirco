import { SetMetadata } from "@nestjs/common";
import { CreateRoleDto } from "../dto";

export interface RoleDecoratorParams {
    minRoleVal: number; // Минимальное значение для доли
    allowSelf?: boolean; // Давать ли доступ самому пользователю безотносительно роли
}

export const ROLES_KEY = 'roles'

export const RoleAccess = (params: RoleDecoratorParams | number) => 
    SetMetadata(
        ROLES_KEY,
        typeof params == 'number' ? { minRoleVal: params } : params,
    );

// INIT ROLES
type BaseRole = 'USER' | 'ADMIN' | 'OWNER';

type InitRoles = {
    [role in BaseRole]: CreateRoleDto;
}

export const initRoles: InitRoles = {
    'USER': {
        name: 'USER',
        value: 1,
        description: 'Базовый пользователь'
    },
    'ADMIN': {
        name: 'ADMIN',
        value: 10,
        description: 'Базовый администратор'
    },
    'OWNER': {
        name: 'OWNER',
        value: 999,
        description: 'Владелец ресурса'
    }
};