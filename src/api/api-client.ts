import { Configuration } from './generated';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5097';

let getTokenFn: (() => string | null) | null = null;

export const setTokenGetter = (fn: () => string | null) => {
    getTokenFn = fn;
};


export const getTokenFromStorage = (): string | null => {
    return localStorage.getItem('token');
};

setTokenGetter(getTokenFromStorage);


export const createApiConfiguration = (): Configuration => {
    console.log('Creating API configuration with basePath:', API_BASE_URL);


    const token = getTokenFn ? getTokenFn() : getTokenFromStorage();
    console.log('Current token:', token ? `Bearer ${token.substring(0, 20)}...` : 'missing');

    return new Configuration({
        basePath: API_BASE_URL,
        accessToken: token || undefined,
    });
};

export const updateApiConfiguration = () => {
    return createApiConfiguration();
};

export { API_BASE_URL };