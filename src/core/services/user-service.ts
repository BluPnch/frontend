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
import globalAxios from "axios";
class UserService {
    private userApi!: UserApi;
    private authApi!: AuthApi;

    constructor() {
        this.initializeApis();
    }

    private initializeApis() {
        const config = createApiConfiguration();

        const axiosInstance = globalAxios.create();

        // Добавляем интерцептор, который ВСЕГДА добавляет токен к запросам
        axiosInstance.interceptors.request.use(
            (request) => {
                const token = this.getToken();

                console.log('🚀 Outgoing request details:');
                console.log('   URL:', request.url);
                console.log('   Method:', request.method);
                console.log('   Current Token:', token ? `${token.substring(0, 50)}...` : 'missing');

                // ВРУЧНУЮ добавляем заголовок Authorization ко всем запросам
                if (token && request.headers) {
                    request.headers.Authorization = `Bearer ${token}`;
                    console.log('   ✅ Added Authorization header:', `Bearer ${token.substring(0, 20)}...`);
                } else {
                    console.log('   ❌ No token available for Authorization header');
                }

                console.log('   Final Headers:', request.headers);

                return request;
            },
            (error) => {
                console.error('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor остается
        axiosInstance.interceptors.response.use(
            (response) => {
                console.log('✅ Response received:');
                console.log('   Status:', response.status);
                console.log('   URL:', response.config.url);
                return response;
            },
            (error) => {
                console.error('❌ Response error:');
                console.log('   URL:', error.config?.url);
                console.log('   Status:', error.response?.status);
                console.log('   Auth Header in request:', error.config?.headers?.Authorization);
                return Promise.reject(error);
            }
        );

        this.userApi = new UserApi(config, undefined, axiosInstance);
        this.authApi = new AuthApi(config, undefined, axiosInstance);
    }

    public updateApiConfig() {
        console.log('Updating API configuration with new token...');
        const config = createApiConfiguration();

        // Создаем новую axios instance с интерцепторами
        const axiosInstance = globalAxios.create();

        // Копируем интерцепторы из initializeApis
        axiosInstance.interceptors.request.use(
            (request) => {
                const token = this.getToken();
                console.log('🚀 Outgoing request details:');
                console.log('   URL:', request.url);
                console.log('   Method:', request.method);
                console.log('   Current Token:', token ? `${token.substring(0, 50)}...` : 'missing');

                if (token && request.headers) {
                    request.headers.Authorization = `Bearer ${token}`;
                    console.log('   ✅ Added Authorization header:', `Bearer ${token.substring(0, 20)}...`);
                } else {
                    console.log('   ❌ No token available for Authorization header');
                }

                return request;
            },
            (error) => {
                console.error('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        axiosInstance.interceptors.response.use(
            (response) => {
                console.log('✅ Response received:');
                console.log('   Status:', response.status);
                console.log('   URL:', response.config.url);
                return response;
            },
            (error) => {
                console.error('❌ Response error:');
                console.log('   URL:', error.config?.url);
                console.log('   Status:', error.response?.status);
                console.log('   Auth Header in request:', error.config?.headers?.Authorization);
                return Promise.reject(error);
            }
        );

        // Создаем API с кастомной axios instance
        this.userApi = new UserApi(config, undefined, axiosInstance);
        this.authApi = new AuthApi(config, undefined, axiosInstance);
    }

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
                this.updateApiConfig(); 
            }

            return response.data;
        } catch (error: unknown) {
            console.error('Failed to login:', error);

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

            if (response.data.token) {
                console.log('Saving token to localStorage and updating API config...');
                localStorage.setItem('token', response.data.token);
                this.updateApiConfig();
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
            console.log('🔐 Token details:');
            console.log('- Full token:', token);
            console.log('- Token length:', token?.length);

            if (!token || token === 'undefined' || token === 'null') {
                console.log('❌ Invalid token format');
                this.logout();
                throw new Error('Invalid token');
            }

            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                console.log('❌ Invalid JWT structure');
                this.logout();
                throw new Error('Invalid JWT structure');
            }

            try {
                const payload = JSON.parse(atob(tokenParts[1]));
                console.log('📋 Token payload:', payload);
                console.log('⏰ Token expiration:', new Date(payload.exp * 1000));

                if (payload.exp && Date.now() >= payload.exp * 1000) {
                    console.log('❌ Token expired');
                    this.logout();
                    throw new Error('Token expired');
                }
            } catch (e) {
                console.log('❌ Cannot decode token payload');
                this.logout();
                throw new Error('Invalid token payload');
            }

            const response = await this.userApi.apiV1UsersMeGet();
            console.log('✅ Current user response:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get current user:', error);

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