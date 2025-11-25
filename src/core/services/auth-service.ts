import { AuthApi } from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';

// Определяем интерфейсы локально, так как они не экспортируются из api.ts
interface LoginRequestDto {
    username?: string | null;
    password?: string | null;
}

interface RegisterRequestDto {
    email?: string | null;
    password?: string | null;
}

interface LoginResponseDto {
    username?: string | null;
    token?: string | null;
}

class AuthService {
    private authApi: AuthApi;

    constructor() {
        // Создаем конфигурацию без токена при инициализации
        const config = createApiConfiguration();
        this.authApi = new AuthApi(config);

        console.log('AuthService initialized with basePath:', this.getBaseUrl());
    }

    private getBaseUrl(): string {
        return 'http://localhost:5097';
    }

    async login(username: string, password: string) {
        const loginData: LoginRequestDto = {
            username,
            password
        };

        try {
            console.log('Attempting login to:', this.getBaseUrl());
            console.log('Login data:', { username, password: '***' });

            try {
                const testResponse = await fetch(`${this.getBaseUrl()}/api/v1/auth/login`, {
                    method: 'OPTIONS',
                });
                console.log('Backend is reachable');
            } catch (error) {
                console.error('Backend is not reachable:', error);
                throw new Error('Сервер недоступен. Проверьте, запущен ли бэкенд на localhost:5097');
            }

            console.log('Sending login request with data:', JSON.stringify(loginData, null, 2));
            

            const response = await this.authApi.apiV1AuthLoginPost({
                serverControllersModelsLoginRequestDto: loginData
            });
            
            console.log('Login response:', response);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username || '');
                console.log('Login successful, token saved');
            }

            return response.data;
        } catch (error : any) {
            console.error('Ошибка входа:', error);

            if (error.response) {
                console.error('Response error data:', error.response.data);
                console.error('Response error status:', error.response.status);
                console.error('Response error headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request error:', error.request);
            }
            
            if (error.code === 'ERR_NETWORK') {
                throw new Error('Не удалось подключиться к серверу. Проверьте:\n1. Запущен ли бэкенд на порту 5097\n2. Не блокирует ли брандмауэр соединение\n3. Корректность URL бэкенда');
            }

            throw error;
        }
    }

    async register(email: string, password: string) {
        const registerData: RegisterRequestDto = {
            email,
            password
        };

        try {
            const response = await this.authApi.apiV1AuthRegisterPost({
                serverControllersModelsRegisterRequestDto: registerData
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username || '');
            }

            return response.data;
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // getCurrentUser() {
    //     const username = localStorage.getItem('username');
    //     const token = localStorage.getItem('token');
    //
    //     if (!username || !token) {
    //         return null;
    //     }
    //
    //     return {
    //         username,
    //     };
    // }

    getAuthHeaders(): { [key: string]: string } {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}

// Создаем экземпляр сервиса
export const authService = new AuthService();