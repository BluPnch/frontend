import { describe, it, expect, vi, beforeEach } from 'vitest';

// Мокаем модули на верхнем уровне
vi.mock('@/api/generated/api', () => {
    const mockApiInstance = {
        // UserApi методы
        apiV1UsersMeGet: vi.fn(),
        // ClientApi методы
        apiV1ClientsIdGet: vi.fn(),
        apiV1ClientsPlantsGet: vi.fn(),
        apiV1ClientsJournalRecordsGet: vi.fn(),
        // PlantApi методы
        apiV1PlantsIdGet: vi.fn(),
        apiV1PlantsPost: vi.fn(),
        apiV1PlantsIdPut: vi.fn(),
        apiV1PlantsIdDelete: vi.fn(),
        apiV1PlantsGet: vi.fn(),
        // SeedApi методы
        apiV1SeedsGet: vi.fn(),
        apiV1SeedsIdGet: vi.fn(),
        apiV1SeedsPost: vi.fn(),
        apiV1SeedsIdPut: vi.fn(),
        apiV1SeedsIdDelete: vi.fn(),
        // JournalRecordApi методы
        apiV1JournalRecordsGet: vi.fn(),
        apiV1JournalRecordsIdGet: vi.fn(),
        apiV1JournalRecordsPost: vi.fn(),
        apiV1JournalRecordsIdPut: vi.fn(),
        apiV1JournalRecordsIdDelete: vi.fn(),
    };

    // Создаем конструкторы которые возвращают тот же инстанс
    const MockUserApi = vi.fn(() => mockApiInstance);
    const MockClientApi = vi.fn(() => mockApiInstance);
    const MockPlantApi = vi.fn(() => mockApiInstance);
    const MockSeedApi = vi.fn(() => mockApiInstance);
    const MockJournalRecordApi = vi.fn(() => mockApiInstance);

    return {
        UserApi: MockUserApi,
        ClientApi: MockClientApi,
        PlantApi: MockPlantApi,
        SeedApi: MockSeedApi,
        JournalRecordApi: MockJournalRecordApi,
        // Экспортируем также инстанс для доступа в тестах
        __mockApiInstance: mockApiInstance,
    };
});

vi.mock('@/api/api-client', () => ({
    createApiConfiguration: vi.fn(() => ({
        basePath: 'http://test.local',
        accessToken: 'test-token',
        baseOptions: {}
    }))
}));

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            interceptors: {
                request: {
                    use: vi.fn()
                },
                response: {
                    use: vi.fn()
                }
            }
        }))
    }
}));

describe('ClientService', () => {
    let mockApiInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Получаем мок инстанс из модуля
        const apiModule = require('@/api/generated/api');
        mockApiInstance = apiModule.__mockApiInstance;

        // Сбрасываем все моки
        Object.values(mockApiInstance).forEach((fn: any) => {
            if (typeof fn.mockReset === 'function') {
                fn.mockReset();
            }
        });
    });

    // Импортируем сервис после мокинга
    const getClientService = () => {
        const { clientService } = require('@/core/services/client-service');
        return clientService;
    };

    describe('getMyProfile', () => {
        it('should fetch client profile', async () => {
            const clientService = getClientService();

            const mockProfile = {
                id: 'client123',
                phoneNumber: '+79991234567'
            };

            mockApiInstance.apiV1UsersMeGet.mockResolvedValue({
                data: mockProfile
            });

            const result = await clientService.getMyProfile();
            expect(result).toEqual(mockProfile);
            expect(mockApiInstance.apiV1UsersMeGet).toHaveBeenCalled();
        });

        it('should throw error when fetching profile fails', async () => {
            const clientService = getClientService();

            mockApiInstance.apiV1UsersMeGet.mockRejectedValue(new Error('Network error'));

            await expect(clientService.getMyProfile()).rejects.toThrow('Network error');
        });
    });

    describe('getClientById', () => {
        it('should fetch client by id', async () => {
            const clientService = getClientService();

            const mockClient = {
                id: 'client123',
                companyName: 'Test Company'
            };

            mockApiInstance.apiV1ClientsIdGet.mockResolvedValue({
                data: mockClient
            });

            const result = await clientService.getClientById('client123');
            expect(result).toEqual(mockClient);
            expect(mockApiInstance.apiV1ClientsIdGet).toHaveBeenCalledWith({ id: 'client123' });
        });
    });

    describe('createPlant', () => {
        it('should create plant successfully', async () => {
            const clientService = getClientService();

            const plantData = {
                family: 'Rosaceae',
                specie: 'Rosa',
                clientId: 'client123'
            };

            const mockResponse = {
                id: 'new-plant',
                ...plantData
            };

            mockApiInstance.apiV1PlantsPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await clientService.createPlant(plantData);
            expect(result).toEqual(mockResponse);
            expect(mockApiInstance.apiV1PlantsPost).toHaveBeenCalledWith({
                serverControllersModelsPlantDTO: plantData
            });
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            const clientService = getClientService();

            localStorage.setItem('token', 'client-service-token');

            const token = (clientService as any).getToken();
            expect(token).toBe('client-service-token');
        });

        it('should return null when no token', () => {
            const clientService = getClientService();

            localStorage.removeItem('token');

            const token = (clientService as any).getToken();
            expect(token).toBeNull();
        });
    });
});