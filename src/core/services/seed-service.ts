import {
    type ServerControllersModelsSeedDTO,
    type ServerControllersModelsEnumsEnumViability,
    type ServerControllersModelsEnumsEnumLight
} from '../../api/generated/api';
import { SeedApi } from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import type { Seed } from '../models/product';
import globalAxios, {type AxiosInstance} from "axios";

class SeedService {
    private seedApi!: SeedApi;
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
                console.log('🚀 SeedService Request:', request.url);

                if (token && request.headers) {
                    request.headers.Authorization = `Bearer ${token}`;
                    console.log('✅ Added Authorization header to seed request');
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
                console.log('✅ SeedService Response:', response.status, response.config.url);
                return response;
            },
            (error) => {
                console.error('❌ SeedService response error:', error.response?.status, error.config?.url);
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    private initializeApis() {
        const config = createApiConfiguration();
        this.seedApi = new SeedApi(config, undefined, this.axiosInstance);
    }

    async getSeeds(maturity?: string, viability?: string): Promise<Seed[]> {
        try {
            console.log('🟡 SeedService: Получение списка семян');
            const response = await this.seedApi.apiV1SeedsGet({
                maturity,
                viability
            });
            console.log('✅ SeedService: Семена успешно получены:', response.data.length);
            return this.mapSeedDTOsToSeeds(response.data);
        } catch (error) {
            console.error('❌ SeedService: Ошибка получения семян:', error);
            throw new Error('Не удалось загрузить список семян');
        }
    }

    async getSeedById(id: string): Promise<Seed> {
        try {
            console.log('🟡 SeedService: Получение семени по ID:', id);
            const response = await this.seedApi.apiV1SeedsIdGet({ id });
            console.log('✅ SeedService: Семя успешно получено');
            return this.mapSeedDTOToSeed(response.data);
        } catch (error) {
            console.error('❌ SeedService: Ошибка получения семени:', error);
            throw new Error('Не удалось загрузить информацию о семени');
        }
    }

    async createSeed(seedData: Seed): Promise<Seed> {
        try {
            console.log('📤 SeedService: Создание семени:', seedData);

            const seedDTO: ServerControllersModelsSeedDTO = {
                plantId: seedData.plantId,
                maturity: seedData.maturity || null,
                viability: this.numberToViabilityEnum(seedData.viability || 0),
                lightRequirements: this.numberToLightEnum(seedData.lightRequirements || 0),
                waterRequirements: seedData.waterRequirements || null,
                temperatureRequirements: seedData.temperatureRequirements || 0
            };

            console.log('📤 SeedService: Преобразованные данные (DTO):', seedDTO);

            const response = await this.seedApi.apiV1SeedsPost({
                serverControllersModelsSeedDTO: seedDTO
            });

            console.log('✅ SeedService: Семя успешно создано:', response.data);
            return this.mapSeedDTOToSeed(response.data);
        } catch (error) {
            console.error('❌ SeedService: Ошибка создания семени:', error);
            throw new Error('Не удалось создать семя');
        }
    }

    async updateSeed(id: string, seedData: Seed): Promise<void> {
        try {
            console.log('📤 SeedService: Обновление семени:', { id, seedData });

            const seedDTO: ServerControllersModelsSeedDTO = {
                id,
                plantId: seedData.plantId,
                maturity: seedData.maturity || null,
                viability: this.numberToViabilityEnum(seedData.viability || 0),
                lightRequirements: this.numberToLightEnum(seedData.lightRequirements || 0),
                waterRequirements: seedData.waterRequirements || null,
                temperatureRequirements: seedData.temperatureRequirements || 0
            };

            await this.seedApi.apiV1SeedsIdPut({
                id: id,
                serverControllersModelsSeedDTO: seedDTO
            });

            console.log('✅ SeedService: Семя успешно обновлено');
        } catch (error) {
            console.error('❌ SeedService: Ошибка обновления семени:', error);
            throw new Error('Не удалось обновить семя');
        }
    }

    async deleteSeed(id: string): Promise<void> {
        try {
            console.log('🟡 SeedService: Удаление семени:', id);
            await this.seedApi.apiV1SeedsIdDelete({ id });
            console.log('✅ SeedService: Семя успешно удалено');
        } catch (error) {
            console.error('❌ SeedService: Ошибка удаления семени:', error);
            throw new Error('Не удалось удалить семя');
        }
    }

    private numberToViabilityEnum(value: number): ServerControllersModelsEnumsEnumViability {
        const validValues = [0, 1, 2, 3, 4, 5, 6];
        if (validValues.includes(value)) {
            return value as ServerControllersModelsEnumsEnumViability;
        }
        return 0;
    }

    private numberToLightEnum(value: number): ServerControllersModelsEnumsEnumLight {
        const validValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        if (validValues.includes(value)) {
            return value as ServerControllersModelsEnumsEnumLight;
        }
        return 0;
    }

    private viabilityEnumToNumber(value: ServerControllersModelsEnumsEnumViability | undefined): number {
        return value !== undefined ? value : 0;
    }

    private lightEnumToNumber(value: ServerControllersModelsEnumsEnumLight | undefined): number {
        return value !== undefined ? value : 0;
    }

    private mapSeedDTOsToSeeds(seedDTOs: ServerControllersModelsSeedDTO[]): Seed[] {
        return seedDTOs.map(dto => this.mapSeedDTOToSeed(dto));
    }

    private mapSeedDTOToSeed(seedDTO: ServerControllersModelsSeedDTO): Seed {
        return {
            id: seedDTO.id || '',
            plantId: seedDTO.plantId || '',
            maturity: seedDTO.maturity || '',
            viability: this.viabilityEnumToNumber(seedDTO.viability),
            lightRequirements: this.lightEnumToNumber(seedDTO.lightRequirements),
            waterRequirements: seedDTO.waterRequirements || '',
            temperatureRequirements: seedDTO.temperatureRequirements || 0
        };
    }

    async getSeedsByPlantId(plantId: string): Promise<Seed[]> {
        try {
            console.log('🟡 SeedService: Получение семян по ID растения:', plantId);
            const allSeeds = await this.getSeeds();
            const filteredSeeds = allSeeds.filter(seed => seed.plantId === plantId);
            console.log('✅ SeedService: Найдено семян:', filteredSeeds.length);
            return filteredSeeds;
        } catch (error) {
            console.error('❌ SeedService: Ошибка получения семян по растению:', error);
            throw new Error('Не удалось загрузить семена растения');
        }
    }
}

export const seedService = new SeedService();