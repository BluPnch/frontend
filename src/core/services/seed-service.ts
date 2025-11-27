import {
    type ServerControllersModelsSeedDTO,
    type ServerControllersModelsEnumsEnumViability,
    type ServerControllersModelsEnumsEnumLight, PlantApi
} from '../../api/generated/api';
import { SeedApi } from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import type { Seed } from '../models/product';
import globalAxios, {type AxiosInstance} from "axios";

class SeedService {
    private seedApi: SeedApi;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = globalAxios.create();
        this.setupInterceptors();
        this.initializeApis();
    }

    private initializeApis() {
        const config = createApiConfiguration();
        this.seedApi = new SeedApi(config, undefined, this.axiosInstance);
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use(
            (request) => {
                const token = this.getToken();
                console.log('🚀 AdminService Request:', request.url);

                if (token && request.headers) {
                    request.headers.Authorization = `Bearer ${token}`;
                    console.log('✅ Added Authorization header to admin request');
                }
                return request;
            },
            (error) => {
                console.error('❌ AdminService request error:', error);
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

    /**
     * Получить все семена с возможностью фильтрации
     */
    async getSeeds(maturity?: string, viability?: string): Promise<Seed[]> {
        try {
            const response = await this.seedApi.apiV1SeedsGet({
                maturity,
                viability
            });
            return this.mapSeedDTOsToSeeds(response.data);
        } catch (error) {
            console.error('Failed to get seeds:', error);
            throw new Error('Не удалось загрузить список семян');
        }
    }

    /**
     * Получить семя по ID
     */
    async getSeedById(id: string): Promise<Seed> {
        try {
            const response = await this.seedApi.apiV1SeedsIdGet({ id });
            return this.mapSeedDTOToSeed(response.data);
        } catch (error) {
            console.error('Failed to get seed:', error);
            throw new Error('Не удалось загрузить информацию о семени');
        }
    }

    /**
     * Создать новое семя
     */
    async createSeed(seedData: Partial<Seed>): Promise<Seed> {
        try {
            const seedDTO: ServerControllersModelsSeedDTO = {
                plantId: seedData.plantId,
                maturity: seedData.maturity || null,
                viability: this.numberToViabilityEnum(seedData.viability || 0),
                lightRequirements: this.numberToLightEnum(seedData.lightRequirements || 0),
                waterRequirements: seedData.waterRequirements || null,
                temperatureRequirements: seedData.temperatureRequirements
            };

            const response = await this.seedApi.apiV1SeedsPost({
                serverControllersModelsSeedDTO: seedDTO
            });
            return this.mapSeedDTOToSeed(response.data);
        } catch (error) {
            console.error('Failed to create seed:', error);
            throw new Error('Не удалось создать семя');
        }
    }


    /**
     * Обновить семя
     */
    async updateSeed(id: string, seedData: Partial<Seed>): Promise<void> {
        try {
            const seedDTO: ServerControllersModelsSeedDTO = {
                id,
                plantId: seedData.plantId,
                maturity: seedData.maturity || null,
                viability: seedData.viability as ServerControllersModelsEnumsEnumViability,
                lightRequirements: seedData.lightRequirements as ServerControllersModelsEnumsEnumLight,
                waterRequirements: seedData.waterRequirements || null,
                temperatureRequirements: seedData.temperatureRequirements
            };

            await this.seedApi.apiV1SeedsIdPut({
                id,
                serverControllersModelsSeedDTO: seedDTO
            });
        } catch (error) {
            console.error('Failed to update seed:', error);
            throw new Error('Не удалось обновить семя');
        }
    }

    /**
     * Удалить семя
     */
    async deleteSeed(id: string): Promise<void> {
        try {
            await this.seedApi.apiV1SeedsIdDelete({ id });
        } catch (error) {
            console.error('Failed to delete seed:', error);
            throw new Error('Не удалось удалить семя');
        }
    }

    /**
     * Получить семена по ID растения
     */
    async getSeedsByPlantId(plantId: string): Promise<Seed[]> {
        try {
            const allSeeds = await this.getSeeds();
            return allSeeds.filter(seed => seed.plantId === plantId);
        } catch (error) {
            console.error('Failed to get seeds by plant ID:', error);
            throw new Error('Не удалось загрузить семена растения');
        }
    }

    /**
     * Получить семена по жизнеспособности
     */
    async getSeedsByViability(viability: ServerControllersModelsEnumsEnumViability): Promise<Seed[]> {
        try {
            const viabilityString = this.viabilityEnumToString(viability);
            const response = await this.seedApi.apiV1SeedsGet({
                viability: viabilityString
            });
            return this.mapSeedDTOsToSeeds(response.data);
        } catch (error) {
            console.error('Failed to get seeds by viability:', error);
            throw new Error('Не удалось загрузить семена по жизнеспособности');
        }
    }

    /**
     * Получить семена по требованиям к освещению
     */
    async getSeedsByLightRequirements(lightRequirements: ServerControllersModelsEnumsEnumLight): Promise<Seed[]> {
        try {
            const allSeeds = await this.getSeeds();
            return allSeeds.filter(seed => seed.lightRequirements === lightRequirements);
        } catch (error) {
            console.error('Failed to get seeds by light requirements:', error);
            throw new Error('Не удалось загрузить семена по требованиям к освещению');
        }
    }

    // Вспомогательные методы для преобразования данных

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
            temperatureRequirements: seedDTO.temperatureRequirements || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    private viabilityEnumToString(viability: ServerControllersModelsEnumsEnumViability): string {
        const viabilityMap: Record<ServerControllersModelsEnumsEnumViability, string> = {
            0: 'Очень низкая',
            1: 'Низкая',
            2: 'Средняя',
            3: 'Высокая',
            4: 'Очень высокая',
            5: 'Отличная',
            6: 'Неизвестно'
        };
        return viabilityMap[viability] || viability.toString();
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

    /**
     * Получить статистику по семенам
     */
    async getSeedStats(): Promise<{
        total: number;
        byViability: Record<string, number>;
        byLightRequirements: Record<string, number>;
    }> {
        try {
            const seeds = await this.getSeeds();

            const byViability: Record<string, number> = {};
            const byLightRequirements: Record<string, number> = {};

            seeds.forEach(seed => {
                // Статистика по жизнеспособности
                const viabilityKey = this.viabilityEnumToString(seed.viability as ServerControllersModelsEnumsEnumViability);
                byViability[viabilityKey] = (byViability[viabilityKey] || 0) + 1;

                // Статистика по требованиям к освещению
                const lightKey = `Требования к свету: ${seed.lightRequirements}`;
                byLightRequirements[lightKey] = (byLightRequirements[lightKey] || 0) + 1;
            });

            return {
                total: seeds.length,
                byViability,
                byLightRequirements
            };
        } catch (error) {
            console.error('Failed to get seed stats:', error);
            throw new Error('Не удалось загрузить статистику семян');
        }
    }
}

export const seedService = new SeedService();