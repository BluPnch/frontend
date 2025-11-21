import { AuthApi } from '../../api/generated/api';

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
        this.authApi = new AuthApi();

        // Добавляем интерцепторы для включения токена в запросы
        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Добавляем интерцептор запросов для включения токена авторизации
        this.authApi.axios.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Добавляем интерцептор ответов для обработки ошибок авторизации
        this.authApi.axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.logout();
                    // Опционально: перенаправление на страницу входа
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async login(username: string, password: string) {
        const loginData: LoginRequestDto = {
            username,
            password
        };

        try {
            const response = await this.authApi.apiV1AuthLoginPost({
                serverControllersModelsLoginRequestDto: loginData
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username || '');
            }

            return response.data;
        } catch (error) {
            console.error('Ошибка входа:', error);
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
        // Опционально: перенаправление на страницу входа
        window.location.href = '/login';
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getCurrentUser() {
        const username = localStorage.getItem('username');
        return username ? { username } : null;
    }

    // Вспомогательный метод для получения заголовков авторизации для других API вызовов
    getAuthHeaders(): { [key: string]: string } {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}

export const authService = new AuthService();