import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ServerControllersModelsPlantDTO } from '@/api/generated/api';

// Mock Configuration
vi.mock('@/api/generated', () => ({
    Configuration: vi.fn().mockImplementation((config) => ({
        basePath: config?.basePath || '',
        accessToken: config?.accessToken,
        baseOptions: config?.baseOptions || {},
        isJsonMime: vi.fn(() => true),
        get apiKey() { return undefined; },
        set apiKey(value: string | undefined) {},
        get username() { return undefined; },
        set username(value: string | undefined) {},
        get password() { return undefined; },
        set password(value: string | undefined) {}
    }))
}));

// Mock PlantApi
const mockPlantApi = {
    apiV1PlantsGet: vi.fn(),
    apiV1PlantsIdGet: vi.fn(),
    apiV1PlantsPost: vi.fn(),
    apiV1PlantsIdPut: vi.fn(),
    apiV1PlantsIdDelete: vi.fn(),
};

vi.mock('@/api/generated/api', () => ({
    PlantApi: vi.fn(() => mockPlantApi),
}));

// Mock axios
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
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Reset mock implementations
        mockPlantApi.apiV1PlantsGet.mockReset();
        mockPlantApi.apiV1PlantsIdGet.mockReset();
        mockPlantApi.apiV1PlantsPost.mockReset();
        mockPlantApi.apiV1PlantsIdPut.mockReset();
        mockPlantApi.apiV1PlantsIdDelete.mockReset();

        // Set mock implementation
        (require('@/api/generated/api').PlantApi as any).mockImplementation(() => mockPlantApi);
    });

    const createTestInstance = () => {
        const PlantService = require('@/core/services/plant-service').PlantService;
        const instance = new PlantService();

        // Manually set the plantApi for testing
        (instance as any).plantApi = mockPlantApi;

        return instance;
    };

    describe('getPlants', () => {
        it('should fetch plants without filters', async () => {
            const instance = createTestInstance();

            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' },
                { id: 'plant2', family: 'Liliaceae', specie: 'Lilium' }
            ];

            mockPlantApi.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await instance.getPlants();

            expect(result).toEqual(mockPlants);
            expect(mockPlantApi.apiV1PlantsGet).toHaveBeenCalledWith({
                family: undefined,
                species: undefined
            });
        });

        it('should fetch plants with filters', async () => {
            const instance = createTestInstance();

            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' }
            ];

            mockPlantApi.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await instance.getPlants('Rosaceae', 'Rosa');

            expect(result).toEqual(mockPlants);
            expect(mockPlantApi.apiV1PlantsGet).toHaveBeenCalledWith({
                family: 'Rosaceae',
                species: 'Rosa'
            });
        });

        it('should throw error when fetching fails', async () => {
            const instance = createTestInstance();

            mockPlantApi.apiV1PlantsGet.mockRejectedValue(new Error('Database error'));

            await expect(instance.getPlants()).rejects.toThrow('Database error');
        });
    });

    describe('getPlantById', () => {
        it('should fetch plant by ID', async () => {
            const instance = createTestInstance();

            const mockPlant: ServerControllersModelsPlantDTO = {
                id: 'plant123',
                family: 'Rosaceae',
                specie: 'Rosa',
                clientId: 'client123'
            };

            mockPlantApi.apiV1PlantsIdGet.mockResolvedValue({
                data: mockPlant
            });

            const result = await instance.getPlantById('plant123');

            expect(result).toEqual(mockPlant);
            expect(mockPlantApi.apiV1PlantsIdGet).toHaveBeenCalledWith({ id: 'plant123' });
        });

        it('should throw error when fetching fails', async () => {
            const instance = createTestInstance();

            mockPlantApi.apiV1PlantsIdGet.mockRejectedValue(new Error('Not found'));

            await expect(instance.getPlantById('plant123')).rejects.toThrow('Not found');
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

        it('should log creation process', async () => {
            const instance = createTestInstance();
            const consoleSpy = vi.spyOn(console, 'log');

            const plantData: ServerControllersModelsPlantDTO = {
                family: 'Test',
                specie: 'Test',
                clientId: 'test-client'
            };

            const mockResponse: ServerControllersModelsPlantDTO = {
                id: 'new-plant',
                ...plantData
            };

            mockPlantApi.apiV1PlantsPost.mockResolvedValue({
                data: mockResponse
            });

            await instance.createPlant(plantData);

            expect(consoleSpy).toHaveBeenCalledWith('🔍 PlantService: Creating plant with data:', expect.any(String));
            expect(consoleSpy).toHaveBeenCalledWith('✅ PlantService: Plant created successfully:', mockResponse);
        });

        it('should log detailed error on failure', async () => {
            const instance = createTestInstance();
            const consoleSpy = vi.spyOn(console, 'error');

            const plantData: ServerControllersModelsPlantDTO = {
                family: 'Test',
                specie: 'Test',
                clientId: 'test-client'
            };

            const axiosError = {
                response: {
                    status: 400,
                    statusText: 'Bad Request',
                    data: { message: 'Invalid data' },
                    headers: { 'content-type': 'application/json' }
                }
            };

            mockPlantApi.apiV1PlantsPost.mockRejectedValue(axiosError);

            await expect(instance.createPlant(plantData)).rejects.toThrow();

            expect(consoleSpy).toHaveBeenCalledWith('❌ PlantService: Failed to create plant:', axiosError);
            expect(consoleSpy).toHaveBeenCalledWith('❌ PlantService: Error details:', expect.any(Object));
        });

        it('should throw error when creation fails', async () => {
            const instance = createTestInstance();

            const plantData: ServerControllersModelsPlantDTO = {
                family: 'Test',
                specie: 'Test',
                clientId: 'test-client'
            };

            mockPlantApi.apiV1PlantsPost.mockRejectedValue(new Error('Creation failed'));

            await expect(instance.createPlant(plantData)).rejects.toThrow('Creation failed');
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

        it('should throw error when update fails', async () => {
            const instance = createTestInstance();

            const plantData: ServerControllersModelsPlantDTO = {
                id: 'plant123',
                family: 'Updated Family',
                specie: 'Updated Species'
            };

            mockPlantApi.apiV1PlantsIdPut.mockRejectedValue(new Error('Update failed'));

            await expect(instance.updatePlant('plant123', plantData)).rejects.toThrow('Update failed');
        });
    });

    describe('deletePlant', () => {
        it('should delete plant successfully', async () => {
            const instance = createTestInstance();

            mockPlantApi.apiV1PlantsIdDelete.mockResolvedValue({});

            await instance.deletePlant('plant123');

            expect(mockPlantApi.apiV1PlantsIdDelete).toHaveBeenCalledWith({ id: 'plant123' });
        });

        it('should throw error when deletion fails', async () => {
            const instance = createTestInstance();

            mockPlantApi.apiV1PlantsIdDelete.mockRejectedValue(new Error('Delete failed'));

            await expect(instance.deletePlant('plant123')).rejects.toThrow('Delete failed');
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            const instance = createTestInstance();

            localStorage.setItem('token', 'plant-service-token');

            const token = (instance as any).getToken();
            expect(token).toBe('plant-service-token');
        });

        it('should handle missing token', () => {
            const instance = createTestInstance();

            localStorage.removeItem('token');

            const token = (instance as any).getToken();
            expect(token).toBeNull();
        });
    });

    describe('interceptors', () => {
        it('should handle request errors', async () => {
            const instance = createTestInstance();
            const consoleSpy = vi.spyOn(console, 'error');

            const mockError = new Error('Request failed');
            mockPlantApi.apiV1PlantsGet.mockRejectedValue(mockError);

            await expect(instance.getPlants()).rejects.toThrow();

            expect(consoleSpy).toHaveBeenCalledWith('❌ PlantService request error:', mockError);
        });

        it('should handle response errors', async () => {
            const instance = createTestInstance();
            const consoleSpy = vi.spyOn(console, 'error');

            const mockError = {
                response: {
                    status: 404,
                    statusText: 'Not Found'
                },
                config: {
                    url: '/api/v1/plants'
                }
            };

            mockPlantApi.apiV1PlantsGet.mockRejectedValue(mockError);

            await expect(instance.getPlants()).rejects.toThrow();

            expect(consoleSpy).toHaveBeenCalledWith('❌ PlantService response error:', 404, '/api/v1/plants');
        });
    });

    describe('error handling', () => {
        it('should wrap unknown errors with custom message', async () => {
            const instance = createTestInstance();

            mockPlantApi.apiV1PlantsGet.mockRejectedValue('Unknown error string');

            await expect(instance.getPlants()).rejects.toThrow('Ошибка получения списка растений');
        });
    });
});