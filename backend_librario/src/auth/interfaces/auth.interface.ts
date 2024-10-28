export interface JwtPayload {
    email: string;
    iat?: Date;
    exp?: Date;
}

export interface LoginAuth {
    token: string;
}