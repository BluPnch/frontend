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
    const basePath = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5097';

    const token = getTokenFn ? getTokenFn() : localStorage.getItem('token');

    console.log('Creating API configuration with:');
    console.log('- basePath:', basePath);
    console.log('- token:', token ? `present (${token.substring(0, 20)}...)` : 'missing');

    return new Configuration({
        basePath,
        accessToken: token || undefined,
    });
};

export const updateApiConfiguration = () => {
    return createApiConfiguration();
};

export { API_BASE_URL };