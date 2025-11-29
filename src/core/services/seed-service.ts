import {
    SeedApi,
    type ServerControllersModelsSeedDTO
} from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import globalAxios, { type AxiosInstance } from "axios";

class SeedService {
    private seedApi!: SeedApi;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = globalAxios.create();
        this.setupInterceptors();
        this.initializeApi();
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use(
            (request) => {
                const token = this.getToken();
                if (token && request.headers) {
                    request.headers.Authorization = `Bearer ${token}`;
                }
                return request;
            },
            (error) => {
                console.error('❌ SeedService request error:', error);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                console.error('❌ SeedService response error:', error.response?.status, error.config?.url);
                return Promise.reject(error);
            }
        );
    }

    private initializeApi() {
        const config = createApiConfiguration();
        this.seedApi = new SeedApi(config, undefined, this.axiosInstance);
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Получить семена с фильтрацией
    async getSeeds(maturity?: string, viability?: string): Promise<ServerControllersModelsSeedDTO[]> {
        try {
            const response = await this.seedApi.apiV1SeedsGet({
                maturity,
                viability
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get seeds:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения списка семян');
        }
    }

    // Получить семя по ID
    async getSeedById(id: string): Promise<ServerControllersModelsSeedDTO> {
        try {
            const response = await this.seedApi.apiV1SeedsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get seed:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных семени');
        }
    }

    // Создать новое семя
    async createSeed(seed: ServerControllersModelsSeedDTO): Promise<ServerControllersModelsSeedDTO> {
        try {
            const response = await this.seedApi.apiV1SeedsPost({
                serverControllersModelsSeedDTO: seed
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to create seed:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка создания семени');
        }
    }

    // Обновить семя
    async updateSeed(id: string, seed: ServerControllersModelsSeedDTO): Promise<void> {
        try {
            await this.seedApi.apiV1SeedsIdPut({
                id,
                serverControllersModelsSeedDTO: seed
            });
        } catch (error: unknown) {
            console.error('Failed to update seed:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка обновления семени');
        }
    }

    // Удалить семя
    async deleteSeed(id: string): Promise<void> {
        try {
            await this.seedApi.apiV1SeedsIdDelete({ id });
        } catch (error: unknown) {
            console.error('Failed to delete seed:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка удаления семени');
        }
    }
}

export const seedService = new SeedService();