import { UserApi } from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';

class UserService {
    private getBaseUrl(): string {
        return 'http://localhost:5097';
    }

    private createUserApi(): UserApi {
        const config = createApiConfiguration();
        return new UserApi(config);
    }

    async getCurrentUser() {
        try {
            console.log('Fetching current user...');
            const token = localStorage.getItem('token');
            console.log('Token exists:', !!token);

            // Создаем новый экземпляр API для каждого запроса
            const userApi = this.createUserApi();
            const response = await userApi.apiV1UsersMeGet();

            console.log('Current user response:', response);
            return response.data;
        } catch (error: any) {
            console.error('Failed to get current user:', error);

            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }

            throw error;
        }
    }

    async getAllUsers() {
        const userApi = this.createUserApi();
        try {
            const response = await userApi.apiV1UsersGet();
            return response.data;
        } catch (error) {
            console.error('Failed to get users:', error);
            throw error;
        }
    }
}

export const userService = new UserService();