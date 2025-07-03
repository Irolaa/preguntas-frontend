import { useAppStore } from './useAppStore';
import { AuthenticationResponse } from '../models/users.models';

import {
    getJwtToken,
    removeJwtToken,
    setJwtToken,
    decodeJwtToken,
} from '../services/cookies.service';

export const useSessionHandler = () => {
    const sessionContext = useAppStore(store => store.session);
    const setSessionContext = useAppStore(store => store.setSession);
    const clearSessionContext = useAppStore(store => store.clearSession);

    const isSessionValid = (): boolean => {
        const jwtToken = getJwtToken();
        if (!jwtToken) return false;
        const decodedToken = decodeJwtToken(jwtToken);
        return decodedToken && decodedToken.exp > Date.now() / 1000;
    };

    const setSessionStore = (response: AuthenticationResponse) => {
        const { token } = response;

        setSessionContext({ token });
        setJwtToken(token);
    };

    const clearSession = () => {
        clearSessionContext();
        removeJwtToken();
    };

    const loadSessionFromStorage = () => {
        const jwtToken = getJwtToken();

        if (jwtToken) {
            const decodedToken = decodeJwtToken(jwtToken);
            if (decodedToken) {
                setSessionContext({ token: jwtToken });
            }
        }
    };

    const getRoleFromToken = (token: string | null): string | null => {
        if (!token) return null;
    
        try {
            const decoded: any = decodeJwtToken(token);
            return decoded.roles || null;
        } catch (e) {
            console.error('Error al decodificar el token', e);
            return null;
        }
    };

    const getIdFromToken = (token: string | undefined): string | null => {
        if (!token) return null;

        try {
        const decoded: any = decodeJwtToken(token);
        return decoded.id || null;
        } catch (e) {
        console.error('Error al decodificar el token', e);
        return null;
        }
    };

    return {
        isSessionValid,
        sessionContext,
        setSessionStore,
        clearSession,
        loadSessionFromStorage,
        getRoleFromToken,
        getIdFromToken
    };
};