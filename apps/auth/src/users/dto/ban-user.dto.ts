
export class BanUserDto {
    readonly userId: number;
    readonly banReason: string;
}

export class UnbanUserDto {
    readonly userId: number;
}