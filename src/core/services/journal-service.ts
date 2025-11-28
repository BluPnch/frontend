import {
    JournalRecordApi,
    GrowthStageApi
} from '../../api/generated/api';
import type {
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsGrowthStageDTO,
    ServerControllersModelsEnumsEnumCondition
} from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import type { JournalRecord, GrowthStage } from '../models/product';
import globalAxios, {type AxiosInstance} from "axios";

export class JournalService {
    private journalRecordApi!: JournalRecordApi;
    private growthStageApi!: GrowthStageApi;
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
                console.log('🚀 JournalService Request:', request.url);

                if (token && request.headers) {
                    request.headers.Authorization = `Bearer ${token}`;
                    console.log('✅ Added Authorization header to journal request');
                }
                return request;
            },
            (error) => {
                console.error('❌ JournalService request error:', error);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log('✅ JournalService Response:', response.status, response.config.url);
                return response;
            },
            (error) => {
                console.error('❌ JournalService response error:', error.response?.status, error.config?.url);
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    private initializeApis() {
        const config = createApiConfiguration();
        this.journalRecordApi = new JournalRecordApi(config, undefined, this.axiosInstance);
        this.growthStageApi = new GrowthStageApi(config, undefined, this.axiosInstance);
    }

    // Методы для работы с записями журнала
    async getJournalRecords(plantId?: string, startDate?: string, endDate?: string): Promise<JournalRecord[]> {
        try {
            const response = await this.journalRecordApi.apiV1JournalRecordsGet({
                plantId,
                startDate,
                endDate
            });
            return this.mapJournalRecordDTOsToJournalRecords(response.data);
        } catch (error: unknown) {
            console.error('Failed to get journal records:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения записей журнала');
        }
    }

    async getJournalRecordById(id: string): Promise<JournalRecord> {
        try {
            const response = await this.journalRecordApi.apiV1JournalRecordsIdGet({ id });
            return this.mapJournalRecordDTOToJournalRecord(response.data);
        } catch (error: unknown) {
            console.error('Failed to get journal record:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения записи журнала');
        }
    }

    async createJournalRecord(data: JournalRecord): Promise<JournalRecord> {
        try {
            console.log('📤 JournalService: Отправка данных на сервер:', data);

            // Преобразуем данные в формат DTO
            const requestData: ServerControllersModelsJournalRecordDTO = {
                plantId: data.plantId,
                growthStageId: data.growthStageId,
                employeeId: data.employeeId,
                plantHeight: data.plantHeight,
                fruitCount: data.fruitCount,
                condition: this.numberToConditionEnum(data.condition),
                date: data.date
            };

            console.log('📤 JournalService: Преобразованные данные (DTO):', requestData);

            // Используем правильный метод API
            const response = await this.journalRecordApi.apiV1JournalRecordsPost({
                serverControllersModelsJournalRecordDTO: requestData
            });

            console.log('✅ JournalService: Запись успешно создана:', response.data);

            // Преобразуем ответ обратно в JournalRecord
            return this.mapJournalRecordDTOToJournalRecord(response.data);
        } catch (error) {
            console.error('❌ JournalService: Ошибка создания записи:', error);
            throw new Error('Не удалось создать запись журнала');
        }
    }

    async updateJournalRecord(id: string, data: JournalRecord): Promise<void> {
        try {
            console.log('📤 JournalService: Обновление записи:', { id, data });

            const requestData: ServerControllersModelsJournalRecordDTO = {
                plantId: data.plantId,
                growthStageId: data.growthStageId,
                employeeId: data.employeeId,
                plantHeight: data.plantHeight,
                fruitCount: data.fruitCount,
                condition: this.numberToConditionEnum(data.condition),
                date: data.date
            };

            await this.journalRecordApi.apiV1JournalRecordsIdPut({
                id: id,
                serverControllersModelsJournalRecordDTO: requestData
            });

            console.log('✅ JournalService: Запись успешно обновлена');
        } catch (error) {
            console.error('❌ JournalService: Ошибка обновления записи:', error);
            throw new Error('Не удалось обновить запись журнала');
        }
    }

    async deleteJournalRecord(id: string): Promise<void> {
        try {
            await this.journalRecordApi.apiV1JournalRecordsIdDelete({ id });
        } catch (error: unknown) {
            console.error('Failed to delete journal record:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка удаления записи журнала');
        }
    }

    // Методы для работы со стадиями роста
    async getGrowthStages(name?: string): Promise<GrowthStage[]> {
        try {
            const response = await this.growthStageApi.apiV1GrowthStagesGet({ name });
            return this.mapGrowthStageDTOsToGrowthStages(response.data);
        } catch (error: unknown) {
            console.error('Failed to get growth stages:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения стадий роста');
        }
    }

    async getGrowthStageById(id: string): Promise<GrowthStage> {
        try {
            const response = await this.growthStageApi.apiV1GrowthStagesIdGet({ id });
            return this.mapGrowthStageDTOToGrowthStage(response.data);
        } catch (error: unknown) {
            console.error('Failed to get growth stage:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения стадии роста');
        }
    }


    private mapJournalRecordDTOsToJournalRecords(dtos: ServerControllersModelsJournalRecordDTO[]): JournalRecord[] {
        return dtos.map(dto => this.mapJournalRecordDTOToJournalRecord(dto));
    }

    private mapJournalRecordDTOToJournalRecord(dto: ServerControllersModelsJournalRecordDTO): JournalRecord {
        return {
            id: dto.id || '',
            plantId: dto.plantId || '',
            growthStageId: dto.growthStageId || '',
            employeeId: dto.employeeId || '',
            plantHeight: dto.plantHeight || 0,
            fruitCount: dto.fruitCount || 0,
            condition: this.conditionEnumToNumber(dto.condition),
            date: dto.date || new Date().toISOString()
        };
    }

    private mapGrowthStageDTOsToGrowthStages(dtos: ServerControllersModelsGrowthStageDTO[]): GrowthStage[] {
        return dtos.map(dto => this.mapGrowthStageDTOToGrowthStage(dto));
    }

    private mapGrowthStageDTOToGrowthStage(dto: ServerControllersModelsGrowthStageDTO): GrowthStage {
        return {
            id: dto.id || '',
            name: dto.name || '',
            description: dto.description || ''
        };
    }

    private numberToConditionEnum(value: number): ServerControllersModelsEnumsEnumCondition {
        const validValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        if (validValues.includes(value)) {
            return value as ServerControllersModelsEnumsEnumCondition;
        }
        return 0;
    }

    private conditionEnumToNumber(value: ServerControllersModelsEnumsEnumCondition | undefined): number {
        return value !== undefined ? value : 0;
    }

    async getJournalRecordsByPlant(plantId: string): Promise<JournalRecord[]> {
        return this.getJournalRecords(plantId);
    }

    async getJournalRecordsByDateRange(startDate: string, endDate: string): Promise<JournalRecord[]> {
        return this.getJournalRecords(undefined, startDate, endDate);
    }

    async getJournalStats(): Promise<{
        total: number;
        byPlant: Record<string, number>;
        byCondition: Record<string, number>;
    }> {
        try {
            const records = await this.getJournalRecords();

            const byPlant: Record<string, number> = {};
            const byCondition: Record<string, number> = {};

            records.forEach(record => {
                // Статистика по растениям
                byPlant[record.plantId] = (byPlant[record.plantId] || 0) + 1;

                // Статистика по состоянию
                const conditionKey = `Состояние: ${record.condition}`;
                byCondition[conditionKey] = (byCondition[conditionKey] || 0) + 1;
            });

            return {
                total: records.length,
                byPlant,
                byCondition
            };
        } catch (error) {
            console.error('Failed to get journal stats:', error);
            throw new Error('Не удалось загрузить статистику журнала');
        }
    }
}

export const journalService = new JournalService();