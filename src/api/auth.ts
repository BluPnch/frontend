import { setAuthToken, apiUtils } from './api-client';

// Ключи для хранения токена
const AUTH_TOKEN_KEY = 'authToken';

// Инициализация токена при загрузке приложения
export const initializeAuth = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        setAuthToken(token);
    }
};

// Сохранение токена
export const saveAuthToken = (token: string, rememberMe: boolean = false) => {
    setAuthToken(token);
    if (rememberMe) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }
};

// Выход из системы
export const logout = () => {
    apiUtils.clearAuth();
};

// Проверка авторизации
export const isAuthenticated = (): boolean => {
    return !!(localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY));
};