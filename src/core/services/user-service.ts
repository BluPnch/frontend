import { UserApi } from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';

class UserService {
    private userApi: UserApi;

    constructor() {
        // Передаем конфигурацию с токеном
        const config = createApiConfiguration();
        this.userApi = new UserApi(config);

        console.log('UserService initialized with basePath:', this.getBaseUrl());
    }

    private getBaseUrl(): string {
        return 'http://localhost:5097';
    }

    async getCurrentUser() {
        try {
            console.log('Fetching current user...');
            console.log('Token exists:', !!localStorage.getItem('token'));

            const response = await this.userApi.apiV1UsersMeGet();
            console.log('Current user response:', response);
            return response.data;
        } catch (error: any) {
            console.error('Failed to get current user:', error);

            // Детальная информация об ошибке
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            }

            throw error;
        }
    }

    async getAllUsers() {
        try {
            const response = await this.userApi.apiV1UsersGet();
            return response.data;
        } catch (error) {
            console.error('Failed to get users:', error);
            throw error;
        }
    }
}

export const userService = new UserService();