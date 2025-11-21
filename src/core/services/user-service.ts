import { UserApi } from '../../api/generated/api';

class UserService {
    private userApi: UserApi;

    constructor() {
        // ИСПРАВЛЕНО: используем базовую конфигурацию
        this.userApi = new UserApi();
    }

    async getCurrentUser() {
        try {
            const response = await this.userApi.apiV1UsersMeGet();
            return response.data;
        } catch (error) {
            console.error('Failed to get current user:', error);
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