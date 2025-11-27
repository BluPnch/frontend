// user-service.ts
import {
    UserApi,
    AuthApi
} from '../../api/generated/api';
import type {
    ServerControllersModelsUserDTO,
    ServerControllersModelsAuthUserDTO,
    ServerControllersModelsLoginRequestDto,
    ServerControllersModelsRegisterRequestDto,
    ServerControllersModelsLoginResponseDto
} from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import type { AxiosError } from 'axios';

class UserService {
    private userApi!: UserApi;
    private authApi!: AuthApi;

    constructor() {
        this.initializeApis();
    }

    private initializeApis() {
        const config = createApiConfiguration();
        this.userApi = new UserApi(config);
        this.authApi = new AuthApi(config);
    }

    public updateApiConfig() {
        console.log('Updating API configuration with new token...');
        const config = createApiConfiguration();
        this.userApi = new UserApi(config);
        this.authApi = new AuthApi(config);
    }

    // Метод для получения токена
    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    async login(credentials: ServerControllersModelsLoginRequestDto): Promise<ServerControllersModelsLoginResponseDto> {
        try {
            const response = await this.authApi.apiV1AuthLoginPost({
                serverControllersModelsLoginRequestDto: credentials
            });

            // Сохраняем токен после успешного логина
            if (response.data.token) {
                console.log('Saving token to localStorage and updating API config...');
                localStorage.setItem('token', response.data.token);
                this.updateApiConfig(); // Обновляем конфигурацию с новым токеном
            }

            return response.data;
        } catch (error: unknown) {
            console.error('Failed to login:', error);

            // Типизируем ошибку для лучшего сообщения
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка входа');
            } else {
                throw new Error('Неизвестная ошибка при входе');
            }
        }
    }

    async register(userData: ServerControllersModelsRegisterRequestDto): Promise<ServerControllersModelsLoginResponseDto> {
        try {
            const response = await this.authApi.apiV1AuthRegisterPost({
                serverControllersModelsRegisterRequestDto: userData
            });

            // Сохраняем токен после успешной регистрации
            if (response.data.token) {
                console.log('Saving token to localStorage and updating API config...');
                localStorage.setItem('token', response.data.token);
                this.updateApiConfig(); // Обновляем конфигурацию с новым токеном
            }

            return response.data;
        } catch (error: unknown) {
            console.error('Failed to register:', error);

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка регистрации');
            } else {
                throw new Error('Неизвестная ошибка при регистрации');
            }
        }
    }

    async getCurrentUser(): Promise<ServerControllersModelsUserDTO> {
        try {
            const token = this.getToken();
            console.log('Getting current user with token:', token ? `present (${token.substring(0, 20)}...)` : 'missing');

            const response = await this.userApi.apiV1UsersMeGet();
            console.log('Current user response:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get current user:', error);

            // Проверяем, является ли ошибка AxiosError и имеет статус 401
            if (this.isAxiosError(error) && error.response?.status === 401) {
                console.log('Token is invalid, logging out...');
                this.logout();
            }

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка получения данных пользователя');
            } else {
                throw new Error('Неизвестная ошибка при получении данных пользователя');
            }
        }
    }

    async getAllUsers(): Promise<ServerControllersModelsAuthUserDTO[]> {
        try {
            const response = await this.userApi.apiV1UsersGet();
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get users:', error);

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка получения списка пользователей');
            } else {
                throw new Error('Неизвестная ошибка при получении списка пользователей');
            }
        }
    }

    // Вспомогательный метод для проверки типа ошибки
    private isAxiosError(error: unknown): error is AxiosError {
        return (error as AxiosError).isAxiosError !== undefined;
    }

    logout(): void {
        console.log('Logging out, removing token...');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.updateApiConfig();
    }

    isAuthenticated(): boolean {
        const isAuth = !!this.getToken();
        console.log('isAuthenticated:', isAuth);
        return isAuth;
    }
}

export const userService = new UserService();