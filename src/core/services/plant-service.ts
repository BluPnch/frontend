import {
    type ServerControllersModelsPlantDTO,
    type ServerControllersModelsEnumsEnumFlowers,
    type ServerControllersModelsEnumsEnumFruit,
    type ServerControllersModelsEnumsEnumReproduction
} from '../../api/generated/api';
import { PlantApi } from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import type { Plant } from '../models/product';
import globalAxios, {type AxiosInstance} from "axios";

class PlantService {
    private plantApi!: PlantApi;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = globalAxios.create();
        this.setupInterceptors();
        this.initializeApis();
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use(
            (request) => {
                const token = this.getToken();
                console.log('🚀 PlantService Request:', request.url);

                if (token && request.headers) {
                    request.headers.Authorization = `Bearer ${token}`;
                    console.log('✅ Added Authorization header to plant request');
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
                console.log('✅ PlantService Response:', response.status, response.config.url);
                return response;
            },
            (error) => {
                console.error('❌ PlantService response error:', error.response?.status, error.config?.url);
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    private initializeApis() {
        const config = createApiConfiguration();
        this.plantApi = new PlantApi(config, undefined, this.axiosInstance);
    }

    async getPlants(family?: string, species?: string): Promise<Plant[]> {
        try {
            console.log('🟡 PlantService: Получение списка растений');
            const response = await this.plantApi.apiV1PlantsGet({ family, species });
            console.log('✅ PlantService: Растения успешно получены:', response.data.length);
            return this.mapPlantDTOsToPlants(response.data);
        } catch (error) {
            console.error('❌ PlantService: Ошибка получения растений:', error);
            throw new Error('Не удалось загрузить список растений');
        }
    }

    async getPlantById(id: string): Promise<Plant> {
        try {
            console.log('🟡 PlantService: Получение растения по ID:', id);
            const response = await this.plantApi.apiV1PlantsIdGet({ id });
            console.log('✅ PlantService: Растение успешно получено');
            return this.mapPlantDTOToPlant(response.data);
        } catch (error) {
            console.error('❌ PlantService: Ошибка получения растения:', error);
            throw new Error('Не удалось загрузить информацию о растении');
        }
    }

    async createPlant(plantData: Plant): Promise<Plant> {
        try {
            console.log('📤 PlantService: Создание растения:', plantData);

            const plantDTO: ServerControllersModelsPlantDTO = {
                clientId: plantData.clientId,
                specie: plantData.specie || null,
                family: plantData.family || null,
                flower: this.numberToFlowerEnum(plantData.flower || 0),
                fruit: this.numberToFruitEnum(plantData.fruit || 0),
                reproduction: this.numberToReproductionEnum(plantData.reproduction || 0)
            };

            console.log('📤 PlantService: Преобразованные данные (DTO):', plantDTO);

            const response = await this.plantApi.apiV1PlantsPost({
                serverControllersModelsPlantDTO: plantDTO
            });

            console.log('✅ PlantService: Растение успешно создано:', response.data);
            return this.mapPlantDTOToPlant(response.data);
        } catch (error) {
            console.error('❌ PlantService: Ошибка создания растения:', error);
            throw new Error('Не удалось создать растение');
        }
    }

    async updatePlant(id: string, plantData: Plant): Promise<void> {
        try {
            console.log('📤 PlantService: Обновление растения:', { id, plantData });

            const plantDTO: ServerControllersModelsPlantDTO = {
                id,
                clientId: plantData.clientId,
                specie: plantData.specie || null,
                family: plantData.family || null,
                flower: this.numberToFlowerEnum(plantData.flower || 0),
                fruit: this.numberToFruitEnum(plantData.fruit || 0),
                reproduction: this.numberToReproductionEnum(plantData.reproduction || 0)
            };

            await this.plantApi.apiV1PlantsIdPut({
                id: id,
                serverControllersModelsPlantDTO: plantDTO
            });

            console.log('✅ PlantService: Растение успешно обновлено');
        } catch (error) {
            console.error('❌ PlantService: Ошибка обновления растения:', error);
            throw new Error('Не удалось обновить растение');
        }
    }

    async deletePlant(id: string): Promise<void> {
        try {
            console.log('🟡 PlantService: Удаление растения:', id);
            await this.plantApi.apiV1PlantsIdDelete({ id });
            console.log('✅ PlantService: Растение успешно удалено');
        } catch (error) {
            console.error('❌ PlantService: Ошибка удаления растения:', error);
            throw new Error('Не удалось удалить растение');
        }
    }

    private numberToFlowerEnum(value: number): ServerControllersModelsEnumsEnumFlowers {
        const validValues = [0, 1, 2, 3, 4, 5, 6];
        if (validValues.includes(value)) {
            return value as ServerControllersModelsEnumsEnumFlowers;
        }
        return 0;
    }

    private numberToFruitEnum(value: number): ServerControllersModelsEnumsEnumFruit {
        const validValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        if (validValues.includes(value)) {
            return value as ServerControllersModelsEnumsEnumFruit;
        }
        return 0;
    }

    private numberToReproductionEnum(value: number): ServerControllersModelsEnumsEnumReproduction {
        const validValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        if (validValues.includes(value)) {
            return value as ServerControllersModelsEnumsEnumReproduction;
        }
        return 0;
    }

    private flowerEnumToNumber(value: ServerControllersModelsEnumsEnumFlowers | undefined): number {
        return value !== undefined ? value : 0;
    }

    private fruitEnumToNumber(value: ServerControllersModelsEnumsEnumFruit | undefined): number {
        return value !== undefined ? value : 0;
    }

    private reproductionEnumToNumber(value: ServerControllersModelsEnumsEnumReproduction | undefined): number {
        return value !== undefined ? value : 0;
    }

    private mapPlantDTOsToPlants(plantDTOs: ServerControllersModelsPlantDTO[]): Plant[] {
        return plantDTOs.map(dto => this.mapPlantDTOToPlant(dto));
    }

    private mapPlantDTOToPlant(plantDTO: ServerControllersModelsPlantDTO): Plant {
        return {
            id: plantDTO.id || '',
            clientId: plantDTO.clientId || '',
            specie: plantDTO.specie || '',
            family: plantDTO.family || '',
            flower: this.flowerEnumToNumber(plantDTO.flower),
            fruit: this.fruitEnumToNumber(plantDTO.fruit),
            reproduction: this.reproductionEnumToNumber(plantDTO.reproduction)
        };
    }

    async getPlantsByClient(clientId: string): Promise<Plant[]> {
        try {
            const allPlants = await this.getPlants();
            return allPlants.filter(plant => plant.clientId === clientId);
        } catch (error) {
            console.error('❌ PlantService: Ошибка получения растений клиента:', error);
            throw new Error('Не удалось загрузить растения клиента');
        }
    }
}

export const plantService = new PlantService();