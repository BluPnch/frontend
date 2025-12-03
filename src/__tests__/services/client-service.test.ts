import { clientService } from '../../core/services/client-service';
import type {
    ServerControllersModelsClientDTO,
    ServerControllersModelsPlantDTO,
    ServerControllersModelsSeedDTO,
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsUserDTO
} from '../../api/generated/api';
import {
    mockApiResponse,
    createMockError,
    mockNetworkError
} from '../mocks/api-mocks';

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
    ClientApi: jest.fn().mockImplementation(() => ({
        apiV1ClientsIdGet: jest.fn(),
        apiV1ClientsPlantsGet: jest.fn(),
        apiV1ClientsJournalRecordsGet: jest.fn(),
    })),
    PlantApi: jest.fn().mockImplementation(() => ({
        apiV1PlantsGet: jest.fn(),
        apiV1PlantsIdGet: jest.fn(),
        apiV1PlantsPost: jest.fn(),
        apiV1PlantsIdPut: jest.fn(),
        apiV1PlantsIdDelete: jest.fn(),
    })),
    SeedApi: jest.fn().mockImplementation(() => ({
        apiV1SeedsGet: jest.fn(),
        apiV1SeedsIdGet: jest.fn(),
        apiV1SeedsPost: jest.fn(),
        apiV1SeedsIdPut: jest.fn(),
        apiV1SeedsIdDelete: jest.fn(),
    })),
    JournalRecordApi: jest.fn().mockImplementation(() => ({
        apiV1JournalRecordsGet: jest.fn(),
        apiV1JournalRecordsIdGet: jest.fn(),
        apiV1JournalRecordsPost: jest.fn(),
        apiV1JournalRecordsIdPut: jest.fn(),
        apiV1JournalRecordsIdDelete: jest.fn(),
    })),
    UserApi: jest.fn().mockImplementation(() => ({
        apiV1UsersMeGet: jest.fn(),
    })),
}));

// Мок для createApiConfiguration
jest.mock('../../api/api-client', () => ({
    createApiConfiguration: jest.fn(() => ({})),
}));

// Мок для axios
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: {
                use: jest.fn(),
            },
            response: {
                use: jest.fn(),
            },
        },
    })),
}));

describe('ClientService', () => {
    let mockClientApiInstance: any;
    let mockPlantApiInstance: any;
    let mockSeedApiInstance: any;
    let mockJournalRecordApiInstance: any;
    let mockUserApiInstance: any;

    const mockUserDTO: ServerControllersModelsUserDTO = {
        id: 'user-1',
        phoneNumber: '+1234567890',
    };

    const mockClientDTO: ServerControllersModelsClientDTO = {
        id: 'client-1',
        companyName: 'Test Company',
        phoneNumber: '+0987654321',
    };

    const mockPlantDTO: ServerControllersModelsPlantDTO = {
        id: 'plant-1',
        clientId: 'client-1',
        specie: 'Rosa',
        family: 'Rosaceae',
        flower: 1 as any,
        fruit: 2 as any,
        reproduction: 3 as any,
    };

    const mockSeedDTO: ServerControllersModelsSeedDTO = {
        id: 'seed-1',
        plantId: 'plant-1',
        maturity: 'mature',
        viability: 1 as any,
        lightRequirements: 2 as any,
        waterRequirements: 'moderate',
        temperatureRequirements: 20,
    };

    const mockJournalRecordDTO: ServerControllersModelsJournalRecordDTO = {
        id: 'journal-1',
        plantId: 'plant-1',
        growthStageId: 'stage-1',
        employeeId: 'emp-1',
        plantHeight: 150,
        fruitCount: 10,
        condition: 5,
        date: '2024-12-02T10:00:00Z',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('test-token');

        // Получаем мок экземпляры API
        mockClientApiInstance = (clientService as any).clientApi;
        mockPlantApiInstance = (clientService as any).plantApi;
        mockSeedApiInstance = (clientService as any).seedApi;
        mockJournalRecordApiInstance = (clientService as any).journalRecordApi;
        mockUserApiInstance = (clientService as any).userApi;
    });

    describe('Инициализация', () => {
        it('должен инициализировать все API клиенты', () => {
            expect(mockClientApiInstance).toBeDefined();
            expect(mockPlantApiInstance).toBeDefined();
            expect(mockSeedApiInstance).toBeDefined();
            expect(mockJournalRecordApiInstance).toBeDefined();
            expect(mockUserApiInstance).toBeDefined();
        });

        it('должен предоставлять все публичные методы', () => {
            expect(typeof clientService.getMyProfile).toBe('function');
            expect(typeof clientService.getClientById).toBe('function');

            expect(typeof clientService.getMyPlants).toBe('function');
            expect(typeof clientService.getPlantById).toBe('function');
            expect(typeof clientService.createPlant).toBe('function');
            expect(typeof clientService.updatePlant).toBe('function');
            expect(typeof clientService.deletePlant).toBe('function');

            expect(typeof clientService.getSeeds).toBe('function');
            expect(typeof clientService.getSeedById).toBe('function');
            expect(typeof clientService.createSeed).toBe('function');
            expect(typeof clientService.updateSeed).toBe('function');
            expect(typeof clientService.deleteSeed).toBe('function');

            expect(typeof clientService.getMyJournalRecords).toBe('function');
            expect(typeof clientService.getJournalRecords).toBe('function');
            expect(typeof clientService.getJournalRecordById).toBe('function');
            expect(typeof clientService.createJournalRecord).toBe('function');
            expect(typeof clientService.updateJournalRecord).toBe('function');
            expect(typeof clientService.deleteJournalRecord).toBe('function');

            expect(typeof clientService.searchPlants).toBe('function');
        });
    });

    describe('Профиль клиента', () => {
        describe('getMyProfile', () => {
            it('должен получать профиль текущего пользователя', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockUserDTO);
                mockUserApiInstance.apiV1UsersMeGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getMyProfile();

                // Assert
                expect(mockUserApiInstance.apiV1UsersMeGet).toHaveBeenCalled();
                expect(result.id).toBe('user-1');
                expect(result.phoneNumber).toBe('+1234567890');
            });

            it('должен обрабатывать ошибки при получении профиля', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockUserApiInstance.apiV1UsersMeGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.getMyProfile()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getClientById', () => {
            it('должен получать данные клиента по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockClientDTO);
                mockClientApiInstance.apiV1ClientsIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getClientById('client-1');

                // Assert
                expect(mockClientApiInstance.apiV1ClientsIdGet).toHaveBeenCalledWith({
                    id: 'client-1',
                });
                expect(result.id).toBe('client-1');
                expect(result.companyName).toBe('Test Company');
            });

            it('должен обрабатывать ошибки при получении клиента', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockClientApiInstance.apiV1ClientsIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.getClientById('invalid-id')).rejects.toThrow('Not found');
            });
        });
    });

    describe('Растения клиента', () => {
        describe('getMyPlants', () => {
            it('должен получать растения текущего клиента', async () => {
                // Arrange
                const plants = [mockPlantDTO];
                const mockResponse = mockApiResponse(plants);
                mockClientApiInstance.apiV1ClientsPlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getMyPlants();

                // Assert
                expect(mockClientApiInstance.apiV1ClientsPlantsGet).toHaveBeenCalled();
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('plant-1');
                expect(result[0].clientId).toBe('client-1');
            });

            it('должен обрабатывать ошибки при получении растений клиента', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockClientApiInstance.apiV1ClientsPlantsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.getMyPlants()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getPlantById', () => {
            it('должен получать данные растения по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockPlantDTO);
                mockPlantApiInstance.apiV1PlantsIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getPlantById('plant-1');

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsIdGet).toHaveBeenCalledWith({
                    id: 'plant-1',
                });
                expect(result.id).toBe('plant-1');
                expect(result.specie).toBe('Rosa');
                expect(result.family).toBe('Rosaceae');
            });

            it('должен обрабатывать ошибки при получении растения', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockPlantApiInstance.apiV1PlantsIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.getPlantById('invalid-id')).rejects.toThrow('Not found');
            });
        });

        describe('createPlant', () => {
            it('должен создавать новое растение', async () => {
                // Arrange
                const newPlant = { ...mockPlantDTO, id: '' };
                const createdPlant = { ...newPlant, id: 'new-plant-id' };
                const mockResponse = mockApiResponse(createdPlant);
                mockPlantApiInstance.apiV1PlantsPost.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.createPlant(newPlant);

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsPost).toHaveBeenCalledWith({
                    serverControllersModelsPlantDTO: newPlant,
                });
                expect(result.id).toBe('new-plant-id');
            });

            it('должен обрабатывать ошибки при создании растения', async () => {
                // Arrange
                const error = createMockError('Validation error', 400);
                mockPlantApiInstance.apiV1PlantsPost.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.createPlant(mockPlantDTO)).rejects.toThrow('Validation error');
            });
        });

        describe('updatePlant', () => {
            it('должен обновлять данные растения', async () => {
                // Arrange
                const updatedPlant = { ...mockPlantDTO, specie: 'Updated Rosa' };
                mockPlantApiInstance.apiV1PlantsIdPut.mockResolvedValue({});

                // Act
                await clientService.updatePlant('plant-1', updatedPlant);

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsIdPut).toHaveBeenCalledWith({
                    id: 'plant-1',
                    serverControllersModelsPlantDTO: updatedPlant,
                });
            });

            it('должен обрабатывать ошибки при обновлении растения', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockPlantApiInstance.apiV1PlantsIdPut.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.updatePlant('invalid-id', mockPlantDTO)).rejects.toThrow('Not found');
            });
        });

        describe('deletePlant', () => {
            it('должен удалять растение', async () => {
                // Arrange
                mockPlantApiInstance.apiV1PlantsIdDelete.mockResolvedValue({});

                // Act
                await clientService.deletePlant('plant-1');

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsIdDelete).toHaveBeenCalledWith({
                    id: 'plant-1',
                });
            });

            it('должен обрабатывать ошибки при удалении растения', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockPlantApiInstance.apiV1PlantsIdDelete.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.deletePlant('invalid-id')).rejects.toThrow('Not found');
            });
        });
    });

    describe('Семена', () => {
        describe('getSeeds', () => {
            it('должен получать семена без фильтров', async () => {
                // Arrange
                const seeds = [mockSeedDTO];
                const mockResponse = mockApiResponse(seeds);
                mockSeedApiInstance.apiV1SeedsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getSeeds();

                // Assert
                expect(mockSeedApiInstance.apiV1SeedsGet).toHaveBeenCalledWith({
                    maturity: undefined,
                    viability: undefined,
                });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('seed-1');
                expect(result[0].maturity).toBe('mature');
            });

            it('должен получать семена с фильтрами', async () => {
                // Arrange
                const seeds = [mockSeedDTO];
                const mockResponse = mockApiResponse(seeds);
                mockSeedApiInstance.apiV1SeedsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getSeeds('mature', 'high');

                // Assert
                expect(mockSeedApiInstance.apiV1SeedsGet).toHaveBeenCalledWith({
                    maturity: 'mature',
                    viability: 'high',
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при получении семян', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockSeedApiInstance.apiV1SeedsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.getSeeds()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getSeedById', () => {
            it('должен получать данные семени по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockSeedDTO);
                mockSeedApiInstance.apiV1SeedsIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getSeedById('seed-1');

                // Assert
                expect(mockSeedApiInstance.apiV1SeedsIdGet).toHaveBeenCalledWith({
                    id: 'seed-1',
                });
                expect(result.id).toBe('seed-1');
                expect(result.maturity).toBe('mature');
            });

            it('должен обрабатывать ошибки при получении семени', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockSeedApiInstance.apiV1SeedsIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.getSeedById('invalid-id')).rejects.toThrow('Not found');
            });
        });

        describe('createSeed', () => {
            it('должен создавать новое семя', async () => {
                // Arrange
                const newSeed = { ...mockSeedDTO, id: '' };
                const createdSeed = { ...newSeed, id: 'new-seed-id' };
                const mockResponse = mockApiResponse(createdSeed);
                mockSeedApiInstance.apiV1SeedsPost.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.createSeed(newSeed);

                // Assert
                expect(mockSeedApiInstance.apiV1SeedsPost).toHaveBeenCalledWith({
                    serverControllersModelsSeedDTO: newSeed,
                });
                expect(result.id).toBe('new-seed-id');
            });

            it('должен обрабатывать ошибки при создании семени', async () => {
                // Arrange
                const error = createMockError('Validation error', 400);
                mockSeedApiInstance.apiV1SeedsPost.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.createSeed(mockSeedDTO)).rejects.toThrow('Validation error');
            });
        });

        describe('updateSeed', () => {
            it('должен обновлять данные семени', async () => {
                // Arrange
                const updatedSeed = { ...mockSeedDTO, maturity: 'immature' };
                mockSeedApiInstance.apiV1SeedsIdPut.mockResolvedValue({});

                // Act
                await clientService.updateSeed('seed-1', updatedSeed);

                // Assert
                expect(mockSeedApiInstance.apiV1SeedsIdPut).toHaveBeenCalledWith({
                    id: 'seed-1',
                    serverControllersModelsSeedDTO: updatedSeed,
                });
            });

            it('должен обрабатывать ошибки при обновлении семени', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockSeedApiInstance.apiV1SeedsIdPut.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.updateSeed('invalid-id', mockSeedDTO)).rejects.toThrow('Not found');
            });
        });

        describe('deleteSeed', () => {
            it('должен удалять семя', async () => {
                // Arrange
                mockSeedApiInstance.apiV1SeedsIdDelete.mockResolvedValue({});

                // Act
                await clientService.deleteSeed('seed-1');

                // Assert
                expect(mockSeedApiInstance.apiV1SeedsIdDelete).toHaveBeenCalledWith({
                    id: 'seed-1',
                });
            });

            it('должен обрабатывать ошибки при удалении семени', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockSeedApiInstance.apiV1SeedsIdDelete.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.deleteSeed('invalid-id')).rejects.toThrow('Not found');
            });
        });
    });

    describe('Журнал записей', () => {
        describe('getMyJournalRecords', () => {
            it('должен получать записи журнала текущего клиента', async () => {
                // Arrange
                const journalRecords = [mockJournalRecordDTO];
                const mockResponse = mockApiResponse(journalRecords);
                mockClientApiInstance.apiV1ClientsJournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getMyJournalRecords();

                // Assert
                expect(mockClientApiInstance.apiV1ClientsJournalRecordsGet).toHaveBeenCalled();
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('journal-1');
            });

            it('должен обрабатывать ошибки при получении записей журнала клиента', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockClientApiInstance.apiV1ClientsJournalRecordsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.getMyJournalRecords()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getJournalRecords', () => {
            it('должен получать записи журнала без фильтров', async () => {
                // Arrange
                const journalRecords = [mockJournalRecordDTO];
                const mockResponse = mockApiResponse(journalRecords);
                mockJournalRecordApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getJournalRecords();

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    plantId: undefined,
                    startDate: undefined,
                    endDate: undefined,
                });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('journal-1');
            });

            it('должен получать записи журнала с фильтром по plantId', async () => {
                // Arrange
                const journalRecords = [mockJournalRecordDTO];
                const mockResponse = mockApiResponse(journalRecords);
                mockJournalRecordApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getJournalRecords('plant-1');

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    plantId: 'plant-1',
                    startDate: undefined,
                    endDate: undefined,
                });
                expect(result).toHaveLength(1);
            });

            it('должен получать записи журнала с фильтром по дате', async () => {
                // Arrange
                const startDate = '2024-12-01';
                const endDate = '2024-12-31';
                const journalRecords = [mockJournalRecordDTO];
                const mockResponse = mockApiResponse(journalRecords);
                mockJournalRecordApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getJournalRecords(undefined, startDate, endDate);

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    plantId: undefined,
                    startDate,
                    endDate,
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при получении записей журнала', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockJournalRecordApiInstance.apiV1JournalRecordsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.getJournalRecords()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getJournalRecordById', () => {
            it('должен получать запись журнала по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockJournalRecordDTO);
                mockJournalRecordApiInstance.apiV1JournalRecordsIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.getJournalRecordById('journal-1');

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsIdGet).toHaveBeenCalledWith({
                    id: 'journal-1',
                });
                expect(result.id).toBe('journal-1');
                expect(result.plantHeight).toBe(150);
            });

            it('должен обрабатывать ошибки при получении записи журнала', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockJournalRecordApiInstance.apiV1JournalRecordsIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.getJournalRecordById('invalid-id')).rejects.toThrow('Not found');
            });
        });

        describe('createJournalRecord', () => {
            it('должен создавать новую запись журнала', async () => {
                // Arrange
                const newRecord = { ...mockJournalRecordDTO, id: '' };
                const createdRecord = { ...newRecord, id: 'new-journal-id' };
                const mockResponse = mockApiResponse(createdRecord);
                mockJournalRecordApiInstance.apiV1JournalRecordsPost.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.createJournalRecord(newRecord);

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsPost).toHaveBeenCalledWith({
                    serverControllersModelsJournalRecordDTO: newRecord,
                });
                expect(result.id).toBe('new-journal-id');
            });

            it('должен обрабатывать ошибки при создании записи журнала', async () => {
                // Arrange
                const error = createMockError('Validation error', 400);
                mockJournalRecordApiInstance.apiV1JournalRecordsPost.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.createJournalRecord(mockJournalRecordDTO)).rejects.toThrow('Validation error');
            });
        });

        describe('updateJournalRecord', () => {
            it('должен обновлять запись журнала', async () => {
                // Arrange
                const updatedRecord = { ...mockJournalRecordDTO, plantHeight: 200 };
                mockJournalRecordApiInstance.apiV1JournalRecordsIdPut.mockResolvedValue({});

                // Act
                await clientService.updateJournalRecord('journal-1', updatedRecord);

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsIdPut).toHaveBeenCalledWith({
                    id: 'journal-1',
                    serverControllersModelsJournalRecordDTO: updatedRecord,
                });
            });

            it('должен обрабатывать ошибки при обновлении записи журнала', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockJournalRecordApiInstance.apiV1JournalRecordsIdPut.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.updateJournalRecord('invalid-id', mockJournalRecordDTO)).rejects.toThrow('Not found');
            });
        });

        describe('deleteJournalRecord', () => {
            it('должен удалять запись журнала', async () => {
                // Arrange
                mockJournalRecordApiInstance.apiV1JournalRecordsIdDelete.mockResolvedValue({});

                // Act
                await clientService.deleteJournalRecord('journal-1');

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsIdDelete).toHaveBeenCalledWith({
                    id: 'journal-1',
                });
            });

            it('должен обрабатывать ошибки при удалении записи журнала', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockJournalRecordApiInstance.apiV1JournalRecordsIdDelete.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.deleteJournalRecord('invalid-id')).rejects.toThrow('Not found');
            });
        });
    });

    describe('Поиск растений', () => {
        describe('searchPlants', () => {
            it('должен искать растения без фильтров', async () => {
                // Arrange
                const plants = [mockPlantDTO];
                const mockResponse = mockApiResponse(plants);
                mockPlantApiInstance.apiV1PlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.searchPlants();

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                    family: undefined,
                    species: undefined,
                });
                expect(result).toHaveLength(1);
                expect(result[0].specie).toBe('Rosa');
            });

            it('должен искать растения с фильтром по семейству', async () => {
                // Arrange
                const plants = [mockPlantDTO];
                const mockResponse = mockApiResponse(plants);
                mockPlantApiInstance.apiV1PlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.searchPlants('Rosaceae');

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                    family: 'Rosaceae',
                    species: undefined,
                });
                expect(result).toHaveLength(1);
            });

            it('должен искать растения с фильтром по виду', async () => {
                // Arrange
                const plants = [mockPlantDTO];
                const mockResponse = mockApiResponse(plants);
                mockPlantApiInstance.apiV1PlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await clientService.searchPlants(undefined, 'Rosa');

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                    family: undefined,
                    species: 'Rosa',
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при поиске растений', async () => {
                // Arrange
                const error = createMockError('Network error', 500);
                mockPlantApiInstance.apiV1PlantsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(clientService.searchPlants()).rejects.toThrow('Network error');
            });
        });
    });

    describe('Обработка ошибок', () => {
        it('должен корректно обрабатывать не-Error объекты', async () => {
            // Arrange
            mockUserApiInstance.apiV1UsersMeGet.mockRejectedValue('Просто строка ошибки');

            // Act & Assert
            await expect(clientService.getMyProfile()).rejects.toThrow('Ошибка получения профиля клиента');
        });

        it('должен корректно обрабатывать Error объекты', async () => {
            // Arrange
            mockUserApiInstance.apiV1UsersMeGet.mockRejectedValue(new Error('Specific error'));

            // Act & Assert
            await expect(clientService.getMyProfile()).rejects.toThrow('Specific error');
        });
    });
});