import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType } from 'sequelize-typescript';

interface ProfileCreationAttrs {
    username?: string;
    social?: string;
    user_id: number;
}

@Table({ tableName: 'profiles' })
export class Profile extends Model<Profile, ProfileCreationAttrs> {

    @ApiProperty({ example: '11', description: 'Уникальный идентификатор профиля' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'Ubivashka666', description: 'Имя пользователя' })
    @Column({ type: DataType.STRING, allowNull: true })
    username: string;

    @ApiProperty({ example: 'http://ubivashka666.vk.com', description: 'Ссылка на социальную сеть' })
    @Column({ type: DataType.STRING, allowNull: true })
    social: string;

    @ApiProperty({ example: '3', description: 'Уникальный идентификатор пользователя' })
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    user_id: number;
}