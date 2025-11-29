import {
    PlantApi,
    type ServerControllersModelsPlantDTO
} from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import globalAxios, { type AxiosInstance } from "axios";

class PlantService {
    private plantApi!: PlantApi;
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
                console.error('❌ PlantService request error:', error);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                console.error('❌ PlantService response error:', error.response?.status, error.config?.url);
                return Promise.reject(error);
            }
        );
    }

    private initializeApi() {
        const config = createApiConfiguration();
        this.plantApi = new PlantApi(config, undefined, this.axiosInstance);
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Получить растения с фильтрацией
    async getPlants(family?: string, species?: string): Promise<ServerControllersModelsPlantDTO[]> {
        try {
            const response = await this.plantApi.apiV1PlantsGet({
                family,
                species
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get plants:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения списка растений');
        }
    }

    // Получить растение по ID
    async getPlantById(id: string): Promise<ServerControllersModelsPlantDTO> {
        try {
            const response = await this.plantApi.apiV1PlantsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get plant:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных растения');
        }
    }

    // Создать новое растение
    async createPlant(plant: ServerControllersModelsPlantDTO): Promise<ServerControllersModelsPlantDTO> {
        try {
            const response = await this.plantApi.apiV1PlantsPost({
                serverControllersModelsPlantDTO: plant
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to create plant:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка создания растения');
        }
    }

    // Обновить растение
    async updatePlant(id: string, plant: ServerControllersModelsPlantDTO): Promise<void> {
        try {
            await this.plantApi.apiV1PlantsIdPut({
                id,
                serverControllersModelsPlantDTO: plant
            });
        } catch (error: unknown) {
            console.error('Failed to update plant:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка обновления растения');
        }
    }

    // Удалить растение
    async deletePlant(id: string): Promise<void> {
        try {
            await this.plantApi.apiV1PlantsIdDelete({ id });
        } catch (error: unknown) {
            console.error('Failed to delete plant:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка удаления растения');
        }
    }
}

export const plantService = new PlantService();