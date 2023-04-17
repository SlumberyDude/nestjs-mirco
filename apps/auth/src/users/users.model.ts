import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';

interface UserCreationAttrs {
    email: string;
    password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор пользователя' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'user@gmail.com', description: 'Почтовый адрес' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: '4815162342', description: 'Пароль' })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @BelongsToMany( () => Role, () => UserRoles)
    roles: Role[];
}