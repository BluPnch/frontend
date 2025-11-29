import {
    ClientApi,
    PlantApi,
    SeedApi,
    JournalRecordApi,
    UserApi
} from '../../api/generated/api';
import type {
    ServerControllersModelsClientDTO,
    ServerControllersModelsPlantDTO,
    ServerControllersModelsSeedDTO,
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsUserDTO
} from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import globalAxios, {type AxiosInstance} from "axios";

class ClientService {
    private clientApi!: ClientApi;
    private plantApi!: PlantApi;
    private seedApi!: SeedApi;
    private journalRecordApi!: JournalRecordApi;
    private userApi!: UserApi;
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
                console.log('🚀 ClientService Request:', request.url);

                if (token && request.headers) {
                    request.headers.Authorization = `Bearer ${token}`;
                    console.log('✅ Added Authorization header to client request');
                }
                return request;
            },
            (error) => {
                console.error('❌ ClientService request error:', error);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log('✅ ClientService Response:', response.status, response.config.url);
                return response;
            },
            (error) => {
                console.error('❌ ClientService response error:', error.response?.status, error.config?.url);
                return Promise.reject(error);
            }
        );
    }

    private initializeApis() {
        const config = createApiConfiguration();

        this.clientApi = new ClientApi(config, undefined, this.axiosInstance);
        this.plantApi = new PlantApi(config, undefined, this.axiosInstance);
        this.seedApi = new SeedApi(config, undefined, this.axiosInstance);
        this.journalRecordApi = new JournalRecordApi(config, undefined, this.axiosInstance);
        this.userApi = new UserApi(config, undefined, this.axiosInstance);
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Профиль клиента
    async getMyProfile(): Promise<ServerControllersModelsUserDTO> {
        try {
            const response = await this.userApi.apiV1UsersMeGet();
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get client profile:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения профиля клиента');
        }
    }

    async getClientById(id: string): Promise<ServerControllersModelsClientDTO> {
        try {
            const response = await this.clientApi.apiV1ClientsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get client:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных клиента');
        }
    }

    // Растения клиента
    async getMyPlants(): Promise<ServerControllersModelsPlantDTO[]> {
        try {
            const response = await this.clientApi.apiV1ClientsPlantsGet();
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get client plants:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения растений клиента');
        }
    }

    async getPlantById(id: string): Promise<ServerControllersModelsPlantDTO> {
        try {
            const response = await this.plantApi.apiV1PlantsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get plant:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных растения');
        }
    }

    async createPlant(plantData: ServerControllersModelsPlantDTO): Promise<ServerControllersModelsPlantDTO> {
        try {
            const response = await this.plantApi.apiV1PlantsPost({
                serverControllersModelsPlantDTO: plantData
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to create plant:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка создания растения');
        }
    }

    async updatePlant(id: string, plantData: ServerControllersModelsPlantDTO): Promise<void> {
        try {
            await this.plantApi.apiV1PlantsIdPut({
                id,
                serverControllersModelsPlantDTO: plantData
            });
        } catch (error: unknown) {
            console.error('Failed to update plant:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка обновления растения');
        }
    }

    async deletePlant(id: string): Promise<void> {
        try {
            await this.plantApi.apiV1PlantsIdDelete({ id });
        } catch (error: unknown) {
            console.error('Failed to delete plant:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка удаления растения');
        }
    }

    // Семена
    async getSeeds(maturity?: string, viability?: string): Promise<ServerControllersModelsSeedDTO[]> {
        try {
            const response = await this.seedApi.apiV1SeedsGet({
                maturity,
                viability
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get seeds:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения семян');
        }
    }

    async getSeedById(id: string): Promise<ServerControllersModelsSeedDTO> {
        try {
            const response = await this.seedApi.apiV1SeedsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get seed:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных семени');
        }
    }

    async createSeed(seedData: ServerControllersModelsSeedDTO): Promise<ServerControllersModelsSeedDTO> {
        try {
            const response = await this.seedApi.apiV1SeedsPost({
                serverControllersModelsSeedDTO: seedData
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to create seed:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка создания семени');
        }
    }

    async updateSeed(id: string, seedData: ServerControllersModelsSeedDTO): Promise<void> {
        try {
            await this.seedApi.apiV1SeedsIdPut({
                id,
                serverControllersModelsSeedDTO: seedData
            });
        } catch (error: unknown) {
            console.error('Failed to update seed:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка обновления семени');
        }
    }

    async deleteSeed(id: string): Promise<void> {
        try {
            await this.seedApi.apiV1SeedsIdDelete({ id });
        } catch (error: unknown) {
            console.error('Failed to delete seed:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка удаления семени');
        }
    }

    // Журнал записей
    async getMyJournalRecords(): Promise<ServerControllersModelsJournalRecordDTO[]> {
        try {
            const response = await this.clientApi.apiV1ClientsJournalRecordsGet();
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get client journal records:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения записей журнала');
        }
    }

    async getJournalRecords(plantId?: string, startDate?: string, endDate?: string): Promise<ServerControllersModelsJournalRecordDTO[]> {
        try {
            const response = await this.journalRecordApi.apiV1JournalRecordsGet({
                plantId,
                startDate,
                endDate
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get journal records:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения записей журнала');
        }
    }

    async getJournalRecordById(id: string): Promise<ServerControllersModelsJournalRecordDTO> {
        try {
            const response = await this.journalRecordApi.apiV1JournalRecordsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get journal record:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения записи журнала');
        }
    }

    async createJournalRecord(recordData: ServerControllersModelsJournalRecordDTO): Promise<ServerControllersModelsJournalRecordDTO> {
        try {
            const response = await this.journalRecordApi.apiV1JournalRecordsPost({
                serverControllersModelsJournalRecordDTO: recordData
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to create journal record:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка создания записи в журнале');
        }
    }

    async updateJournalRecord(id: string, recordData: ServerControllersModelsJournalRecordDTO): Promise<void> {
        try {
            await this.journalRecordApi.apiV1JournalRecordsIdPut({
                id,
                serverControllersModelsJournalRecordDTO: recordData
            });
        } catch (error: unknown) {
            console.error('Failed to update journal record:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка обновления записи в журнале');
        }
    }

    async deleteJournalRecord(id: string): Promise<void> {
        try {
            await this.journalRecordApi.apiV1JournalRecordsIdDelete({ id });
        } catch (error: unknown) {
            console.error('Failed to delete journal record:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка удаления записи из журнала');
        }
    }

    // Поиск растений
    async searchPlants(family?: string, species?: string): Promise<ServerControllersModelsPlantDTO[]> {
        try {
            const response = await this.plantApi.apiV1PlantsGet({
                family,
                species
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to search plants:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка поиска растений');
        }
    }
}

export const clientService = new ClientService();
