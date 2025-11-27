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

    console.log('🔧 Creating API configuration:');
    console.log('   basePath:', basePath);
    console.log('   token exists:', !!token);
    console.log('   token value:', token ? `${token.substring(0, 30)}...` : 'null');

    const config = new Configuration({
        basePath,
        accessToken: token || undefined,
    });

    console.log('   Configuration accessToken:', config.accessToken ? 'set' : 'not set');

    return config;
};

export const updateApiConfiguration = () => {
    return createApiConfiguration();
};

export { API_BASE_URL };