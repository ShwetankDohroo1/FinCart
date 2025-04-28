import { jwtDecode } from 'jwt-decode';

export type JwtPayload = {
    sub: number;
    name: string;
    email: string;
    role: string;
};

export function decodeToken(token: unknown): JwtPayload | null {
    if (typeof token !== 'string') {
        console.error('decodeToken: token is not a string', token);
        return null;
    }
    try {
        return jwtDecode<JwtPayload>(token);
    } 
    catch (err) {
        console.error('decodeToken: invalid JWT', err);
        return null;
    }
}
