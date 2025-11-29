import {
    EmployeeApi,
    PlantApi,
    JournalRecordApi,
    GrowthStageApi,
    UserApi
} from '../../api/generated/api';
import type {
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsPlantDTO,
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsGrowthStageDTO,
    ServerControllersModelsUserDTO
} from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import globalAxios, {type AxiosInstance} from "axios";

class EmployeeService {
    private currentEmployeeId: string | null = null;
    private employeeApi!: EmployeeApi;
    private plantApi!: PlantApi;
    private journalRecordApi!: JournalRecordApi;
    private growthStageApi!: GrowthStageApi;
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
                console.log('🚀 EmployeeService Request:', request.url);

                if (token && request.headers) {
                    request.headers.Authorization = `Bearer ${token}`;
                    console.log('✅ Added Authorization header to employee request');
                }
                return request;
            },
            (error) => {
                console.error('❌ EmployeeService request error:', error);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log('✅ EmployeeService Response:', response.status, response.config.url);
                return response;
            },
            (error) => {
                console.error('❌ EmployeeService response error:', error.response?.status, error.config?.url);
                return Promise.reject(error);
            }
        );
    }

    private initializeApis() {
        const config = createApiConfiguration();

        this.employeeApi = new EmployeeApi(config, undefined, this.axiosInstance);
        this.plantApi = new PlantApi(config, undefined, this.axiosInstance);
        this.journalRecordApi = new JournalRecordApi(config, undefined, this.axiosInstance);
        this.growthStageApi = new GrowthStageApi(config, undefined, this.axiosInstance);
        this.userApi = new UserApi(config, undefined, this.axiosInstance);
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    async getCurrentEmployeeId(): Promise<string> {
        if (this.currentEmployeeId) {
            return this.currentEmployeeId;
        }

        try {
            const profile = await this.getMyProfile();
            this.currentEmployeeId = profile.id || '';

            if (!this.currentEmployeeId) {
                throw new Error('Не удалось определить ID сотрудника');
            }

            return this.currentEmployeeId;
        } catch (error) {
            console.error('Failed to get current employee ID:', error);
            throw new Error('Не удалось определить ID сотрудника');
        }
    }

    // Профиль сотрудника
    async getMyProfile(): Promise<ServerControllersModelsUserDTO> {
        try {
            const response = await this.userApi.apiV1UsersMeGet();
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get employee profile:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения профиля сотрудника');
        }
    }

    async getEmployeeById(id: string): Promise<ServerControllersModelsEmployeeDTO> {
        try {
            const response = await this.employeeApi.apiV1EmployeesIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get employee:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных сотрудника');
        }
    }

    async getMyPlants(): Promise<ServerControllersModelsPlantDTO[]> {
        try {
            console.log('🟡 EmployeeService: Using GENERAL plants list (all plants)');

            // Используем общий список растений через PlantApi
            const response = await this.plantApi.apiV1PlantsGet();

            console.log('✅ EmployeeService: General plants received:', response.data.length);
            return response.data;
        } catch (error: unknown) {
            console.error('❌ EmployeeService: Failed to get plants:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения растений');
        }
    }

    async getEmployeePlants(employeeId: string): Promise<ServerControllersModelsPlantDTO[]> {
        try {
            const response = await this.employeeApi.apiV1EmployeesPlantsGet({
                employeeId
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get employee plants:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения растений сотрудника');
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

    // Журнал записей
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

    // Стадии роста
    async getGrowthStages(name?: string): Promise<ServerControllersModelsGrowthStageDTO[]> {
        try {
            const response = await this.growthStageApi.apiV1GrowthStagesGet({
                name
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get growth stages:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения стадий роста');
        }
    }

    async getGrowthStageById(id: string): Promise<ServerControllersModelsGrowthStageDTO> {
        try {
            const response = await this.growthStageApi.apiV1GrowthStagesIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get growth stage:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных стадии роста');
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

    // Список сотрудников
    async getEmployees(phoneNumber?: string, task?: string, plantDomain?: string): Promise<ServerControllersModelsEmployeeDTO[]> {
        try {
            const response = await this.employeeApi.apiV1EmployeesGet({
                phoneNumber,
                task,
                plantDomain
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get employees:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения списка сотрудников');
        }
    }
}

export const employeeService = new EmployeeService();
