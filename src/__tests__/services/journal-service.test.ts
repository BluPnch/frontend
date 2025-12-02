import { journalService } from '../../core/services/journal-service';
import type { JournalRecord, GrowthStage } from '../../core/models/product';
import {
    mockJournalRecord,
    mockJournalRecordDTO,
    mockJournalRecordsDTO,
    mockGrowthStage,
    mockGrowthStageDTO,
    mockGrowthStagesDTO,
    mockErrorResponse
} from '../mocks/journal-mocks';

// Мок для localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Моки для API
jest.mock('../../api/generated/api', () => ({
    JournalRecordApi: jest.fn().mockImplementation(() => ({
        apiV1JournalRecordsGet: jest.fn(),
        apiV1JournalRecordsIdGet: jest.fn(),
        apiV1JournalRecordsPost: jest.fn(),
        apiV1JournalRecordsIdPut: jest.fn(),
        apiV1JournalRecordsIdDelete: jest.fn(),
    })),
    GrowthStageApi: jest.fn().mockImplementation(() => ({
        apiV1GrowthStagesGet: jest.fn(),
        apiV1GrowthStagesIdGet: jest.fn(),
    })),
    ServerControllersModelsEnumsEnumCondition: {
        0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10
    }
}));

// Мок для createApiConfiguration
jest.mock('../../api/api-client', () => ({
    createApiConfiguration: jest.fn(() => ({})),
}));

describe('JournalService', () => {
    let mockJournalApiInstance: any;
    let mockGrowthStageApiInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('test-token');

        // Получаем мок экземпляры API
        mockJournalApiInstance = (journalService as any).journalRecordApi;
        mockGrowthStageApiInstance = (journalService as any).growthStageApi;
    });

    describe('Конструктор и инициализация', () => {
        it('должен инициализировать API клиенты', () => {
            expect(mockJournalApiInstance).toBeDefined();
            expect(mockGrowthStageApiInstance).toBeDefined();
        });

        it('должен добавлять токен в заголовки', () => {
            expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
        });
    });

    describe('Методы для JournalRecords', () => {
        describe('getJournalRecords', () => {
            it('должен получать записи журнала без фильтров', async () => {
                // Arrange
                const mockResponse = { data: mockJournalRecordsDTO };
                mockJournalApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.getJournalRecords();

                // Assert
                expect(mockJournalApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({});
                expect(result).toHaveLength(2);
                expect(result[0].id).toBe('journal-1');
            });

            it('должен получать записи журнала с фильтром по plantId', async () => {
                // Arrange
                const mockResponse = { data: [mockJournalRecordDTO] };
                mockJournalApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.getJournalRecords('plant-1');

                // Assert
                expect(mockJournalApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    plantId: 'plant-1'
                });
                expect(result).toHaveLength(1);
            });

            it('должен получать записи журнала с фильтром по дате', async () => {
                // Arrange
                const startDate = '2024-12-01';
                const endDate = '2024-12-31';
                const mockResponse = { data: mockJournalRecordsDTO };
                mockJournalApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.getJournalRecords(undefined, startDate, endDate);

                // Assert
                expect(mockJournalApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    startDate,
                    endDate
                });
                expect(result).toHaveLength(2);
            });

            it('должен обрабатывать ошибки при получении записей', async () => {
                // Arrange
                mockJournalApiInstance.apiV1JournalRecordsGet.mockRejectedValue(new Error('Network error'));

                // Act & Assert
                await expect(journalService.getJournalRecords()).rejects.toThrow('Network error');
            });
        });

        describe('getJournalRecordById', () => {
            it('должен получать запись журнала по ID', async () => {
                // Arrange
                const mockResponse = { data: mockJournalRecordDTO };
                mockJournalApiInstance.apiV1JournalRecordsIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.getJournalRecordById('journal-1');

                // Assert
                expect(mockJournalApiInstance.apiV1JournalRecordsIdGet).toHaveBeenCalledWith({
                    id: 'journal-1'
                });
                expect(result.id).toBe('journal-1');
                expect(result.plantHeight).toBe(150);
            });

            it('должен обрабатывать ошибки при получении записи', async () => {
                // Arrange
                mockJournalApiInstance.apiV1JournalRecordsIdGet.mockRejectedValue(new Error('Not found'));

                // Act & Assert
                await expect(journalService.getJournalRecordById('invalid-id')).rejects.toThrow('Not found');
            });
        });

        describe('createJournalRecord', () => {
            it('должен создавать новую запись журнала', async () => {
                // Arrange
                const newRecord: JournalRecord = {
                    id: '',
                    plantId: 'plant-1',
                    growthStageId: 'stage-1',
                    employeeId: 'emp-1',
                    plantHeight: 100,
                    fruitCount: 5,
                    condition: 3,
                    date: '2024-12-02T10:00:00Z'
                };

                const createdRecordDTO = { ...mockJournalRecordDTO, id: 'new-id' };
                const mockResponse = { data: createdRecordDTO };
                mockJournalApiInstance.apiV1JournalRecordsPost.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.createJournalRecord(newRecord);

                // Assert
                expect(mockJournalApiInstance.apiV1JournalRecordsPost).toHaveBeenCalled();
                expect(result.id).toBe('new-id');
            });

            it('должен обрабатывать ошибки при создании записи', async () => {
                // Arrange
                const newRecord: JournalRecord = { ...mockJournalRecord, id: '' };
                mockJournalApiInstance.apiV1JournalRecordsPost.mockRejectedValue(new Error('Validation error'));

                // Act & Assert
                await expect(journalService.createJournalRecord(newRecord)).rejects.toThrow('Не удалось создать запись журнала');
            });
        });

        describe('updateJournalRecord', () => {
            it('должен обновлять запись журнала', async () => {
                // Arrange
                const updatedRecord: JournalRecord = {
                    ...mockJournalRecord,
                    plantHeight: 200,
                    fruitCount: 15
                };

                mockJournalApiInstance.apiV1JournalRecordsIdPut.mockResolvedValue({});

                // Act
                await journalService.updateJournalRecord('journal-1', updatedRecord);

                // Assert
                expect(mockJournalApiInstance.apiV1JournalRecordsIdPut).toHaveBeenCalledWith({
                    id: 'journal-1',
                    serverControllersModelsJournalRecordDTO: expect.objectContaining({
                        plantHeight: 200,
                        fruitCount: 15,
                        condition: 5 // condition преобразуется в enum
                    })
                });
            });
        });

        describe('deleteJournalRecord', () => {
            it('должен удалять запись журнала', async () => {
                // Arrange
                mockJournalApiInstance.apiV1JournalRecordsIdDelete.mockResolvedValue({});

                // Act
                await journalService.deleteJournalRecord('journal-1');

                // Assert
                expect(mockJournalApiInstance.apiV1JournalRecordsIdDelete).toHaveBeenCalledWith({
                    id: 'journal-1'
                });
            });
        });

        describe('getJournalRecordsByPlant', () => {
            it('должен получать записи по конкретному растению', async () => {
                // Arrange
                const mockResponse = { data: [mockJournalRecordDTO] };
                mockJournalApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.getJournalRecordsByPlant('plant-1');

                // Assert
                expect(mockJournalApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    plantId: 'plant-1'
                });
                expect(result).toHaveLength(1);
            });
        });

        describe('getJournalRecordsByDateRange', () => {
            it('должен получать записи по диапазону дат', async () => {
                // Arrange
                const startDate = '2024-12-01';
                const endDate = '2024-12-31';
                const mockResponse = { data: mockJournalRecordsDTO };
                mockJournalApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.getJournalRecordsByDateRange(startDate, endDate);

                // Assert
                expect(mockJournalApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    startDate,
                    endDate
                });
                expect(result).toHaveLength(2);
            });
        });
    });

    describe('Методы для GrowthStages', () => {
        describe('getGrowthStages', () => {
            it('должен получать стадии роста без фильтра', async () => {
                // Arrange
                const mockResponse = { data: mockGrowthStagesDTO };
                mockGrowthStageApiInstance.apiV1GrowthStagesGet.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.getGrowthStages();

                // Assert
                expect(mockGrowthStageApiInstance.apiV1GrowthStagesGet).toHaveBeenCalledWith({});
                expect(result).toHaveLength(2);
                expect(result[0].name).toBe('Vegetative');
            });

            it('должен получать стадии роста с фильтром по имени', async () => {
                // Arrange
                const mockResponse = { data: [mockGrowthStageDTO] };
                mockGrowthStageApiInstance.apiV1GrowthStagesGet.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.getGrowthStages('Vegetative');

                // Assert
                expect(mockGrowthStageApiInstance.apiV1GrowthStagesGet).toHaveBeenCalledWith({
                    name: 'Vegetative'
                });
                expect(result).toHaveLength(1);
            });
        });

        describe('getGrowthStageById', () => {
            it('должен получать стадию роста по ID', async () => {
                // Arrange
                const mockResponse = { data: mockGrowthStageDTO };
                mockGrowthStageApiInstance.apiV1GrowthStagesIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await journalService.getGrowthStageById('stage-1');

                // Assert
                expect(mockGrowthStageApiInstance.apiV1GrowthStagesIdGet).toHaveBeenCalledWith({
                    id: 'stage-1'
                });
                expect(result.id).toBe('stage-1');
                expect(result.name).toBe('Vegetative');
            });
        });
    });

    describe('Вспомогательные методы', () => {
        describe('getJournalStats', () => {
            it('должен возвращать статистику по журналу', async () => {
                // Arrange
                const mockResponse = { data: mockJournalRecordsDTO };
                mockJournalApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const stats = await journalService.getJournalStats();

                // Assert
                expect(stats.total).toBe(2);
                expect(stats.byPlant['plant-1']).toBe(1);
                expect(stats.byPlant['plant-2']).toBe(1);
                expect(stats.byCondition['Состояние: 5']).toBe(1);
                expect(stats.byCondition['Состояние: 7']).toBe(1);
            });

            it('должен обрабатывать ошибки при получении статистики', async () => {
                // Arrange
                mockJournalApiInstance.apiV1JournalRecordsGet.mockRejectedValue(new Error('Network error'));

                // Act & Assert
                await expect(journalService.getJournalStats()).rejects.toThrow('Не удалось загрузить статистику журнала');
            });
        });

        describe('numberToConditionEnum и conditionEnumToNumber', () => {
            it('должен правильно преобразовывать число в enum и обратно', () => {
                const journalServiceInstance = journalService as any;

                // Проверяем преобразование числа в enum
                const enumValue = journalServiceInstance.numberToConditionEnum(5);
                expect(enumValue).toBe(5);

                // Проверяем преобразование enum в число
                const numberValue = journalServiceInstance.conditionEnumToNumber(5);
                expect(numberValue).toBe(5);

                // Проверяем преобразование undefined в 0
                const undefinedValue = journalServiceInstance.conditionEnumToNumber(undefined);
                expect(undefinedValue).toBe(0);

                // Проверяем некорректное значение
                const invalidValue = journalServiceInstance.numberToConditionEnum(15);
                expect(invalidValue).toBe(0);
            });
        });

        describe('Методы маппинга', () => {
            it('должен правильно маппить DTO в JournalRecord', () => {
                const journalServiceInstance = journalService as any;

                const result = journalServiceInstance.mapJournalRecordDTOToJournalRecord(mockJournalRecordDTO);
                expect(result.id).toBe('journal-1');
                expect(result.condition).toBe(5);
                expect(result.date).toBe('2024-12-02T10:00:00Z');
            });

            it('должен правильно маппить DTO в GrowthStage', () => {
                const journalServiceInstance = journalService as any;

                const result = journalServiceInstance.mapGrowthStageDTOToGrowthStage(mockGrowthStageDTO);
                expect(result.id).toBe('stage-1');
                expect(result.name).toBe('Vegetative');
                expect(result.description).toBe('Vegetative growth stage');
            });

            it('должен правильно маппить массив DTO', () => {
                const journalServiceInstance = journalService as any;

                const records = journalServiceInstance.mapJournalRecordDTOsToJournalRecords(mockJournalRecordsDTO);
                expect(records).toHaveLength(2);
                expect(records[0].id).toBe('journal-1');
                expect(records[1].id).toBe('journal-2');

                const stages = journalServiceInstance.mapGrowthStageDTOsToGrowthStages(mockGrowthStagesDTO);
                expect(stages).toHaveLength(2);
                expect(stages[0].name).toBe('Vegetative');
                expect(stages[1].name).toBe('Flowering');
            });
        });
    });

    describe('Обработка ошибок', () => {
        it('должен корректно обрабатывать не-Error объекты', async () => {
            // Arrange
            mockJournalApiInstance.apiV1JournalRecordsGet.mockRejectedValue('Просто строка ошибки');

            // Act & Assert
            await expect(journalService.getJournalRecords()).rejects.toThrow('Ошибка получения записей журнала');
        });

        it('должен корректно обрабатывать Error объекты', async () => {
            // Arrange
            mockJournalApiInstance.apiV1JournalRecordsGet.mockRejectedValue(new Error('Specific error'));

            // Act & Assert
            await expect(journalService.getJournalRecords()).rejects.toThrow('Specific error');
        });
    });
});