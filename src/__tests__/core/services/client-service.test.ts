import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
    ServerControllersModelsUserDTO,
    ServerControllersModelsClientDTO,
    ServerControllersModelsPlantDTO,
    ServerControllersModelsSeedDTO,
    ServerControllersModelsJournalRecordDTO
} from '@/api/generated/api';

// Простой мок для всего модуля
vi.mock('@/api/generated/api', () => {
    // Создаем мок-функции
    const createMockApi = () => ({
        apiV1UsersMeGet: vi.fn(),
        apiV1ClientsIdGet: vi.fn(),
        apiV1ClientsPlantsGet: vi.fn(),
        apiV1ClientsJournalRecordsGet: vi.fn(),
        apiV1PlantsIdGet: vi.fn(),
        apiV1PlantsPost: vi.fn(),
        apiV1PlantsIdPut: vi.fn(),
        apiV1PlantsIdDelete: vi.fn(),
        apiV1PlantsGet: vi.fn(),
        apiV1SeedsGet: vi.fn(),
        apiV1SeedsIdGet: vi.fn(),
        apiV1SeedsPost: vi.fn(),
        apiV1SeedsIdPut: vi.fn(),
        apiV1SeedsIdDelete: vi.fn(),
        apiV1JournalRecordsGet: vi.fn(),
        apiV1JournalRecordsIdGet: vi.fn(),
        apiV1JournalRecordsPost: vi.fn(),
        apiV1JournalRecordsIdPut: vi.fn(),
        apiV1JournalRecordsIdDelete: vi.fn(),
    });

    const mockApi = createMockApi();

    return {
        UserApi: vi.fn(() => ({
            apiV1UsersMeGet: mockApi.apiV1UsersMeGet,
        })),
        ClientApi: vi.fn(() => ({
            apiV1ClientsIdGet: mockApi.apiV1ClientsIdGet,
            apiV1ClientsPlantsGet: mockApi.apiV1ClientsPlantsGet,
            apiV1ClientsJournalRecordsGet: mockApi.apiV1ClientsJournalRecordsGet,
        })),
        PlantApi: vi.fn(() => ({
            apiV1PlantsIdGet: mockApi.apiV1PlantsIdGet,
            apiV1PlantsPost: mockApi.apiV1PlantsPost,
            apiV1PlantsIdPut: mockApi.apiV1PlantsIdPut,
            apiV1PlantsIdDelete: mockApi.apiV1PlantsIdDelete,
            apiV1PlantsGet: mockApi.apiV1PlantsGet,
        })),
        SeedApi: vi.fn(() => ({
            apiV1SeedsGet: mockApi.apiV1SeedsGet,
            apiV1SeedsIdGet: mockApi.apiV1SeedsIdGet,
            apiV1SeedsPost: mockApi.apiV1SeedsPost,
            apiV1SeedsIdPut: mockApi.apiV1SeedsIdPut,
            apiV1SeedsIdDelete: mockApi.apiV1SeedsIdDelete,
        })),
        JournalRecordApi: vi.fn(() => ({
            apiV1JournalRecordsGet: mockApi.apiV1JournalRecordsGet,
            apiV1JournalRecordsIdGet: mockApi.apiV1JournalRecordsIdGet,
            apiV1JournalRecordsPost: mockApi.apiV1JournalRecordsPost,
            apiV1JournalRecordsIdPut: mockApi.apiV1JournalRecordsIdPut,
            apiV1JournalRecordsIdDelete: mockApi.apiV1JournalRecordsIdDelete,
        })),
    };
});

describe('ClientService', () => {
    // Создаем отдельные мок-функции для каждого API
    const mockUserApi = {
        apiV1UsersMeGet: vi.fn(),
    };

    const mockClientApi = {
        apiV1ClientsIdGet: vi.fn(),
        apiV1ClientsPlantsGet: vi.fn(),
        apiV1ClientsJournalRecordsGet: vi.fn(),
    };

    const mockPlantApi = {
        apiV1PlantsIdGet: vi.fn(),
        apiV1PlantsPost: vi.fn(),
        apiV1PlantsIdPut: vi.fn(),
        apiV1PlantsIdDelete: vi.fn(),
        apiV1PlantsGet: vi.fn(),
    };

    const mockSeedApi = {
        apiV1SeedsGet: vi.fn(),
        apiV1SeedsIdGet: vi.fn(),
        apiV1SeedsPost: vi.fn(),
        apiV1SeedsIdPut: vi.fn(),
        apiV1SeedsIdDelete: vi.fn(),
    };

    const mockJournalRecordApi = {
        apiV1JournalRecordsGet: vi.fn(),
        apiV1JournalRecordsIdGet: vi.fn(),
        apiV1JournalRecordsPost: vi.fn(),
        apiV1JournalRecordsIdPut: vi.fn(),
        apiV1JournalRecordsIdDelete: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Сбрасываем все моки
        vi.mocked(mockUserApi.apiV1UsersMeGet).mockReset();
        vi.mocked(mockClientApi.apiV1ClientsIdGet).mockReset();
        vi.mocked(mockClientApi.apiV1ClientsPlantsGet).mockReset();
        vi.mocked(mockClientApi.apiV1ClientsJournalRecordsGet).mockReset();
        vi.mocked(mockPlantApi.apiV1PlantsIdGet).mockReset();
        vi.mocked(mockPlantApi.apiV1PlantsPost).mockReset();
        vi.mocked(mockPlantApi.apiV1PlantsIdPut).mockReset();
        vi.mocked(mockPlantApi.apiV1PlantsIdDelete).mockReset();
        vi.mocked(mockPlantApi.apiV1PlantsGet).mockReset();
        vi.mocked(mockSeedApi.apiV1SeedsGet).mockReset();
        vi.mocked(mockSeedApi.apiV1SeedsIdGet).mockReset();
        vi.mocked(mockSeedApi.apiV1SeedsPost).mockReset();
        vi.mocked(mockSeedApi.apiV1SeedsIdPut).mockReset();
        vi.mocked(mockSeedApi.apiV1SeedsIdDelete).mockReset();
        vi.mocked(mockJournalRecordApi.apiV1JournalRecordsGet).mockReset();
        vi.mocked(mockJournalRecordApi.apiV1JournalRecordsIdGet).mockReset();
        vi.mocked(mockJournalRecordApi.apiV1JournalRecordsPost).mockReset();
        vi.mocked(mockJournalRecordApi.apiV1JournalRecordsIdPut).mockReset();
        vi.mocked(mockJournalRecordApi.apiV1JournalRecordsIdDelete).mockReset();

        // Мокаем импорт модуля
        vi.doMock('@/api/generated/api', () => ({
            UserApi: vi.fn(() => mockUserApi),
            ClientApi: vi.fn(() => mockClientApi),
            PlantApi: vi.fn(() => mockPlantApi),
            SeedApi: vi.fn(() => mockSeedApi),
            JournalRecordApi: vi.fn(() => mockJournalRecordApi),
        }));
    });

    const createTestInstance = () => {
        // Используем динамический импорт
        const ClientService = require('@/core/services/client-service').ClientService;
        const instance = new ClientService();

        // Мокаем API внутри инстанса
        (instance as any).userApi = mockUserApi;
        (instance as any).clientApi = mockClientApi;
        (instance as any).plantApi = mockPlantApi;
        (instance as any).seedApi = mockSeedApi;
        (instance as any).journalRecordApi = mockJournalRecordApi;

        return instance;
    };

    describe('getMyProfile', () => {
        it('should fetch client profile', async () => {
            const instance = createTestInstance();

            const mockProfile: ServerControllersModelsUserDTO = {
                id: 'client123',
                phoneNumber: '+79991234567'
            };

            mockUserApi.apiV1UsersMeGet.mockResolvedValue({
                data: mockProfile
            });

            const result = await instance.getMyProfile();
            expect(result).toEqual(mockProfile);
            expect(mockUserApi.apiV1UsersMeGet).toHaveBeenCalled();
        });

        it('should throw error when fetching profile fails', async () => {
            const instance = createTestInstance();

            const error = new Error('Network error');
            mockUserApi.apiV1UsersMeGet.mockRejectedValue(error);

            await expect(instance.getMyProfile()).rejects.toThrow('Network error');
        });
    });

    describe('getClientById', () => {
        it('should fetch client by id', async () => {
            const instance = createTestInstance();

            const mockClient: ServerControllersModelsClientDTO = {
                id: 'client123',
                companyName: 'Test Company'
            };

            mockClientApi.apiV1ClientsIdGet.mockResolvedValue({
                data: mockClient
            });

            const result = await instance.getClientById('client123');
            expect(result).toEqual(mockClient);
            expect(mockClientApi.apiV1ClientsIdGet).toHaveBeenCalledWith({ id: 'client123' });
        });
    });

    // ... остальные тесты остаются без изменений, но убедитесь, что везде используется instance
    describe('getMyPlants', () => {
        it('should fetch client plants', async () => {
            const instance = createTestInstance();

            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' },
                { id: 'plant2', family: 'Liliaceae', specie: 'Lilium' }
            ];

            mockClientApi.apiV1ClientsPlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await instance.getMyPlants();
            expect(result).toEqual(mockPlants);
            expect(mockClientApi.apiV1ClientsPlantsGet).toHaveBeenCalled();
        });
    });

    describe('getPlantById', () => {
        it('should fetch plant by id', async () => {
            const instance = createTestInstance();

            const mockPlant: ServerControllersModelsPlantDTO = {
                id: 'plant123',
                family: 'Rosaceae',
                specie: 'Rosa'
            };

            mockPlantApi.apiV1PlantsIdGet.mockResolvedValue({
                data: mockPlant
            });

            const result = await instance.getPlantById('plant123');
            expect(result).toEqual(mockPlant);
            expect(mockPlantApi.apiV1PlantsIdGet).toHaveBeenCalledWith({ id: 'plant123' });
        });
    });

    describe('createPlant', () => {
        it('should create plant successfully', async () => {
            const instance = createTestInstance();

            const plantData: ServerControllersModelsPlantDTO = {
                family: 'Rosaceae',
                specie: 'Rosa',
                clientId: 'client123'
            };

            const mockResponse: ServerControllersModelsPlantDTO = {
                id: 'new-plant',
                ...plantData
            };

            mockPlantApi.apiV1PlantsPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await instance.createPlant(plantData);
            expect(result).toEqual(mockResponse);
            expect(mockPlantApi.apiV1PlantsPost).toHaveBeenCalledWith({
                serverControllersModelsPlantDTO: plantData
            });
        });
    });

    describe('updatePlant', () => {
        it('should update plant successfully', async () => {
            const instance = createTestInstance();

            const plantData: ServerControllersModelsPlantDTO = {
                id: 'plant123',
                family: 'Updated Family',
                specie: 'Updated Species'
            };

            mockPlantApi.apiV1PlantsIdPut.mockResolvedValue({});

            await instance.updatePlant('plant123', plantData);
            expect(mockPlantApi.apiV1PlantsIdPut).toHaveBeenCalledWith({
                id: 'plant123',
                serverControllersModelsPlantDTO: plantData
            });
        });
    });

    describe('deletePlant', () => {
        it('should delete plant successfully', async () => {
            const instance = createTestInstance();

            mockPlantApi.apiV1PlantsIdDelete.mockResolvedValue({});

            await instance.deletePlant('plant123');
            expect(mockPlantApi.apiV1PlantsIdDelete).toHaveBeenCalledWith({ id: 'plant123' });
        });
    });

    describe('getSeeds', () => {
        it('should fetch seeds without filters', async () => {
            const instance = createTestInstance();

            const mockSeeds: ServerControllersModelsSeedDTO[] = [
                { id: 'seed1', plantId: 'plant1', waterRequirements: 'Умеренный' },
                { id: 'seed2', plantId: 'plant2', temperatureRequirements: 20 }
            ];

            mockSeedApi.apiV1SeedsGet.mockResolvedValue({
                data: mockSeeds
            });

            const result = await instance.getSeeds();
            expect(result).toEqual(mockSeeds);
            expect(mockSeedApi.apiV1SeedsGet).toHaveBeenCalledWith({
                maturity: undefined,
                viability: undefined
            });
        });

        it('should fetch seeds with filters', async () => {
            const instance = createTestInstance();

            const mockSeeds: ServerControllersModelsSeedDTO[] = [
                { id: 'seed1', plantId: 'plant1', maturity: 'Созревшие' }
            ];

            mockSeedApi.apiV1SeedsGet.mockResolvedValue({
                data: mockSeeds
            });

            const result = await instance.getSeeds('Созревшие', '1');
            expect(result).toEqual(mockSeeds);
            expect(mockSeedApi.apiV1SeedsGet).toHaveBeenCalledWith({
                maturity: 'Созревшие',
                viability: 1
            });
        });
    });

    describe('getSeedById', () => {
        it('should fetch seed by id', async () => {
            const instance = createTestInstance();

            const mockSeed: ServerControllersModelsSeedDTO = {
                id: 'seed123',
                plantId: 'plant123',
                waterRequirements: 'Умеренный'
            };

            mockSeedApi.apiV1SeedsIdGet.mockResolvedValue({
                data: mockSeed
            });

            const result = await instance.getSeedById('seed123');
            expect(result).toEqual(mockSeed);
            expect(mockSeedApi.apiV1SeedsIdGet).toHaveBeenCalledWith({ id: 'seed123' });
        });
    });

    describe('createSeed', () => {
        it('should create seed successfully', async () => {
            const instance = createTestInstance();

            const seedData: ServerControllersModelsSeedDTO = {
                plantId: 'plant1',
                waterRequirements: 'Умеренный'
            };

            const mockResponse: ServerControllersModelsSeedDTO = {
                id: 'new-seed',
                ...seedData
            };

            mockSeedApi.apiV1SeedsPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await instance.createSeed(seedData);
            expect(result).toEqual(mockResponse);
            expect(mockSeedApi.apiV1SeedsPost).toHaveBeenCalledWith({
                serverControllersModelsSeedDTO: seedData
            });
        });
    });

    describe('updateSeed', () => {
        it('should update seed successfully', async () => {
            const instance = createTestInstance();

            const seedData: ServerControllersModelsSeedDTO = {
                plantId: 'plant1',
                waterRequirements: 'Умеренный'
            };

            mockSeedApi.apiV1SeedsIdPut.mockResolvedValue({});

            await instance.updateSeed('seed123', seedData);
            expect(mockSeedApi.apiV1SeedsIdPut).toHaveBeenCalledWith({
                id: 'seed123',
                serverControllersModelsSeedDTO: seedData
            });
        });
    });

    describe('deleteSeed', () => {
        it('should delete seed successfully', async () => {
            const instance = createTestInstance();

            mockSeedApi.apiV1SeedsIdDelete.mockResolvedValue({});

            await instance.deleteSeed('seed123');
            expect(mockSeedApi.apiV1SeedsIdDelete).toHaveBeenCalledWith({ id: 'seed123' });
        });
    });

    describe('getMyJournalRecords', () => {
        it('should fetch client journal records', async () => {
            const instance = createTestInstance();

            const mockRecords: ServerControllersModelsJournalRecordDTO[] = [
                { id: 'record1', plantId: 'plant1' },
                { id: 'record2', plantId: 'plant2' }
            ];

            mockClientApi.apiV1ClientsJournalRecordsGet.mockResolvedValue({
                data: mockRecords
            });

            const result = await instance.getMyJournalRecords();
            expect(result).toEqual(mockRecords);
            expect(mockClientApi.apiV1ClientsJournalRecordsGet).toHaveBeenCalled();
        });
    });

    describe('getJournalRecords', () => {
        it('should fetch journal records with filters', async () => {
            const instance = createTestInstance();

            const mockRecords: ServerControllersModelsJournalRecordDTO[] = [
                { id: 'record1', plantId: 'plant1' }
            ];

            mockJournalRecordApi.apiV1JournalRecordsGet.mockResolvedValue({
                data: mockRecords
            });

            const result = await instance.getJournalRecords('plant1', '2024-01-01', '2024-12-31');
            expect(result).toEqual(mockRecords);
            expect(mockJournalRecordApi.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                plantId: 'plant1',
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            });
        });
    });

    describe('getJournalRecordById', () => {
        it('should fetch journal record by id', async () => {
            const instance = createTestInstance();

            const mockRecord: ServerControllersModelsJournalRecordDTO = {
                id: 'record123',
                plantId: 'plant123'
            };

            mockJournalRecordApi.apiV1JournalRecordsIdGet.mockResolvedValue({
                data: mockRecord
            });

            const result = await instance.getJournalRecordById('record123');
            expect(result).toEqual(mockRecord);
            expect(mockJournalRecordApi.apiV1JournalRecordsIdGet).toHaveBeenCalledWith({ id: 'record123' });
        });
    });

    describe('createJournalRecord', () => {
        it('should create journal record successfully', async () => {
            const instance = createTestInstance();

            const recordData: ServerControllersModelsJournalRecordDTO = {
                plantId: 'plant1',
                growthStageId: 'stage1',
                employeeId: 'emp1'
            };

            const mockResponse: ServerControllersModelsJournalRecordDTO = {
                id: 'new-record',
                ...recordData
            };

            mockJournalRecordApi.apiV1JournalRecordsPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await instance.createJournalRecord(recordData);
            expect(result).toEqual(mockResponse);
            expect(mockJournalRecordApi.apiV1JournalRecordsPost).toHaveBeenCalledWith({
                serverControllersModelsJournalRecordDTO: recordData
            });
        });
    });

    describe('updateJournalRecord', () => {
        it('should update journal record successfully', async () => {
            const instance = createTestInstance();

            const recordData: ServerControllersModelsJournalRecordDTO = {
                id: 'record1',
                plantId: 'plant1'
            };

            mockJournalRecordApi.apiV1JournalRecordsIdPut.mockResolvedValue({});

            await instance.updateJournalRecord('record1', recordData);
            expect(mockJournalRecordApi.apiV1JournalRecordsIdPut).toHaveBeenCalledWith({
                id: 'record1',
                serverControllersModelsJournalRecordDTO: recordData
            });
        });
    });

    describe('deleteJournalRecord', () => {
        it('should delete journal record successfully', async () => {
            const instance = createTestInstance();

            mockJournalRecordApi.apiV1JournalRecordsIdDelete.mockResolvedValue({});

            await instance.deleteJournalRecord('record1');
            expect(mockJournalRecordApi.apiV1JournalRecordsIdDelete).toHaveBeenCalledWith({ id: 'record1' });
        });
    });

    describe('searchPlants', () => {
        it('should search plants with filters', async () => {
            const instance = createTestInstance();

            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' }
            ];

            mockPlantApi.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await instance.searchPlants('Rosaceae', 'Rosa');
            expect(result).toEqual(mockPlants);
            expect(mockPlantApi.apiV1PlantsGet).toHaveBeenCalledWith({
                family: 'Rosaceae',
                species: 'Rosa'
            });
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            const instance = createTestInstance();

            localStorage.setItem('token', 'client-service-token');

            const token = (instance as any).getToken();
            expect(token).toBe('client-service-token');
        });

        it('should return null when no token', () => {
            const instance = createTestInstance();

            localStorage.removeItem('token');

            const token = (instance as any).getToken();
            expect(token).toBeNull();
        });
    });
});