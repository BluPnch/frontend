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

class UserService {
    private userApi: UserApi;
    private authApi: AuthApi;

    constructor() {
        const config = createApiConfiguration();
        this.userApi = new UserApi(config);
        this.authApi = new AuthApi(config);
    }

    async login(credentials: ServerControllersModelsLoginRequestDto): Promise<ServerControllersModelsLoginResponseDto> {
        try {
            const response = await this.authApi.apiV1AuthLoginPost({
                serverControllersModelsLoginRequestDto: credentials
            });
            return response.data;
        } catch (error) {
            console.error('Failed to login:', error);
            throw error;
        }
    }

    async register(userData: ServerControllersModelsRegisterRequestDto): Promise<ServerControllersModelsLoginResponseDto> {
        try {
            const response = await this.authApi.apiV1AuthRegisterPost({
                serverControllersModelsRegisterRequestDto: userData
            });
            return response.data;
        } catch (error) {
            console.error('Failed to register:', error);
            throw error;
        }
    }

    async getCurrentUser(): Promise<ServerControllersModelsUserDTO> {
        try {
            const response = await this.userApi.apiV1UsersMeGet();
            return response.data;
        } catch (error) {
            console.error('Failed to get current user:', error);
            throw error;
        }
    }

    async getAllUsers(): Promise<ServerControllersModelsAuthUserDTO[]> {
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