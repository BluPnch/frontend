import { describe, it, expect, vi, beforeEach } from 'vitest';

// Мокаем модули на верхнем уровне
vi.mock('@/api/generated/api', () => {
    const mockApiInstance = {
        apiV1PlantsGet: vi.fn(),
        apiV1PlantsIdGet: vi.fn(),
        apiV1PlantsPost: vi.fn(),
        apiV1PlantsIdPut: vi.fn(),
        apiV1PlantsIdDelete: vi.fn(),
    };

    const MockPlantApi = vi.fn(() => mockApiInstance);

    return {
        PlantApi: MockPlantApi,
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

describe('PlantService', () => {
    let mockApiInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Получаем мок инстанс из модуля
        const apiModule = require('@/api/generated/api');
        mockApiInstance = apiModule.__mockApiInstance;

        // Сбрасываем все моки
        mockApiInstance.apiV1PlantsGet.mockReset();
        mockApiInstance.apiV1PlantsIdGet.mockReset();
        mockApiInstance.apiV1PlantsPost.mockReset();
        mockApiInstance.apiV1PlantsIdPut.mockReset();
        mockApiInstance.apiV1PlantsIdDelete.mockReset();
    });

    // Импортируем сервис после мокинга
    const getPlantService = () => {
        const { plantService } = require('@/core/services/plant-service');
        return plantService;
    };

    describe('getPlants', () => {
        it('should fetch plants without filters', async () => {
            const plantService = getPlantService();

            const mockPlants = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' },
                { id: 'plant2', family: 'Liliaceae', specie: 'Lilium' }
            ];

            mockApiInstance.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await plantService.getPlants();

            expect(result).toEqual(mockPlants);
            expect(mockApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                family: undefined,
                species: undefined
            });
        });

        it('should fetch plants with filters', async () => {
            const plantService = getPlantService();

            const mockPlants = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' }
            ];

            mockApiInstance.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await plantService.getPlants('Rosaceae', 'Rosa');

            expect(result).toEqual(mockPlants);
            expect(mockApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                family: 'Rosaceae',
                species: 'Rosa'
            });
        });

        it('should throw error when fetching fails', async () => {
            const plantService = getPlantService();

            mockApiInstance.apiV1PlantsGet.mockRejectedValue(new Error('Database error'));

            await expect(plantService.getPlants()).rejects.toThrow('Database error');
        });
    });

    describe('getPlantById', () => {
        it('should fetch plant by ID', async () => {
            const plantService = getPlantService();

            const mockPlant = {
                id: 'plant123',
                family: 'Rosaceae',
                specie: 'Rosa',
                clientId: 'client123'
            };

            mockApiInstance.apiV1PlantsIdGet.mockResolvedValue({
                data: mockPlant
            });

            const result = await plantService.getPlantById('plant123');

            expect(result).toEqual(mockPlant);
            expect(mockApiInstance.apiV1PlantsIdGet).toHaveBeenCalledWith({ id: 'plant123' });
        });

        it('should throw error when fetching fails', async () => {
            const plantService = getPlantService();

            mockApiInstance.apiV1PlantsIdGet.mockRejectedValue(new Error('Not found'));

            await expect(plantService.getPlantById('plant123')).rejects.toThrow('Not found');
        });
    });

    describe('createPlant', () => {
        it('should create plant successfully', async () => {
            const plantService = getPlantService();

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

            const result = await plantService.createPlant(plantData);

            expect(result).toEqual(mockResponse);
            expect(mockApiInstance.apiV1PlantsPost).toHaveBeenCalledWith({
                serverControllersModelsPlantDTO: plantData
            });
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            const plantService = getPlantService();

            localStorage.setItem('token', 'plant-service-token');

            const token = (plantService as any).getToken();
            expect(token).toBe('plant-service-token');
        });

        it('should handle missing token', () => {
            const plantService = getPlantService();

            localStorage.removeItem('token');

            const token = (plantService as any).getToken();
            expect(token).toBeNull();
        });
    });
});