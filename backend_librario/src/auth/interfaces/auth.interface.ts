export interface JwtPayload {
    email: string;
    id: number;
    iat?: Date;
    exp?: Date;
}

export interface LoginAuth {
    token: string;
}