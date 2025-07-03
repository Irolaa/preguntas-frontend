import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const COOKIE_NAME = 'jwtToken';

export const setJwtToken = (token: string) => {
    Cookies.set(COOKIE_NAME, token, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
    });
};

export const getJwtToken = (): string | undefined => {
  return Cookies.get(COOKIE_NAME);
};

export const removeJwtToken = () => {
    Cookies.remove(COOKIE_NAME);
};

export const decodeJwtToken = (token: string): any => {
    try {
        return jwtDecode(token);
    } catch (e) {
        return null;
    }
};
export const getUsernameFromToken = (): string | null => {
    const token = getJwtToken();
    if (!token) return null;

    const decoded = decodeJwtToken(token);

    return decoded?.username ?? decoded?.sub ?? null;
};