import { CreateRoleDto } from "y/shared/dto";

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