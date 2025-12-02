import { describe, it, expect, vi, beforeEach } from 'vitest';
import { plantService } from '@/core/services/plant-service';
import type { ServerControllersModelsPlantDTO } from '@/api/generated/api';

vi.mock('@/api/generated', () => ({
    Configuration: vi.fn().mockImplementation((config) => ({
        basePath: config?.basePath || '',
        accessToken: config?.accessToken,
        baseOptions: config?.baseOptions || {}
    }))
}));

vi.mock('@/api/generated/api', () => ({
    PlantApi: vi.fn(() => ({
        apiV1PlantsGet: vi.fn(),
        apiV1PlantsIdGet: vi.fn(),
        apiV1PlantsPost: vi.fn(),
        apiV1PlantsIdPut: vi.fn(),
        apiV1PlantsIdDelete: vi.fn(),
    })),
}));

describe('PlantService', () => {
    let mockPlantApi: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Setup mock implementation
        mockPlantApi = {
            apiV1PlantsGet: vi.fn(),
            apiV1PlantsIdGet: vi.fn(),
            apiV1PlantsPost: vi.fn(),
            apiV1PlantsIdPut: vi.fn(),
            apiV1PlantsIdDelete: vi.fn(),
        };
        
        // Reinitialize service
        (plantService as any).initializeApi();
    });

    describe('getPlants', () => {
        it('should fetch plants without filters', async () => {
            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' },
                { id: 'plant2', family: 'Liliaceae', specie: 'Lilium' }
            ];

            mockPlantApi.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await plantService.getPlants();

            expect(result).toEqual(mockPlants);
            expect(mockPlantApi.apiV1PlantsGet).toHaveBeenCalledWith({
                family: undefined,
                species: undefined
            });
        });

        it('should fetch plants with filters', async () => {
            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' }
            ];

            mockPlantApi.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await plantService.getPlants('Rosaceae', 'Rosa');

            expect(result).toEqual(mockPlants);
            expect(mockPlantApi.apiV1PlantsGet).toHaveBeenCalledWith({
                family: 'Rosaceae',
                species: 'Rosa'
            });
        });

        it('should throw error when fetching fails', async () => {
            mockPlantApi.apiV1PlantsGet.mockRejectedValue(new Error('Database error'));

            await expect(plantService.getPlants()).rejects.toThrow('Database error');
        });
    });

    describe('getPlantById', () => {
        it('should fetch plant by ID', async () => {
            // Используйте только те поля, которые определены в типе
            const mockPlant: ServerControllersModelsPlantDTO = {
                id: 'plant123',
                family: 'Rosaceae',
                specie: 'Rosa',
                clientId: 'client123',
                // cultivationDifficulty и floweringTime не существуют в типе
                // flower: { ... }, // если нужно
                // fruit: { ... }, // если нужно
                // reproduction: { ... } // если нужно
            };

            mockPlantApi.apiV1PlantsIdGet.mockResolvedValue({
                data: mockPlant
            });

            const result = await plantService.getPlantById('plant123');

            expect(result).toEqual(mockPlant);
            expect(mockPlantApi.apiV1PlantsIdGet).toHaveBeenCalledWith({ id: 'plant123' });
        });
    });

    describe('createPlant', () => {
        it('should create plant successfully', async () => {
            // Используйте правильные поля из типа
            const plantData: ServerControllersModelsPlantDTO = {
                family: 'Rosaceae',
                specie: 'Rosa',
                clientId: 'client123',
                // cultivationDifficulty и floweringTime не существуют
            };

            const mockResponse: ServerControllersModelsPlantDTO = {
                id: 'new-plant',
                ...plantData
            };

            mockPlantApi.apiV1PlantsPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await plantService.createPlant(plantData);

            expect(result).toEqual(mockResponse);
            expect(mockPlantApi.apiV1PlantsPost).toHaveBeenCalledWith({
                serverControllersModelsPlantDTO: plantData
            });
        });

        it('should log creation process', async () => {
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

            await plantService.createPlant(plantData);

            expect(consoleSpy).toHaveBeenCalledWith('🔍 PlantService: Creating plant with data:', expect.any(String));
            expect(consoleSpy).toHaveBeenCalledWith('✅ PlantService: Plant created successfully:', mockResponse);
        });

        it('should log detailed error on failure', async () => {
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

            await expect(plantService.createPlant(plantData)).rejects.toThrow();

            expect(consoleSpy).toHaveBeenCalledWith('❌ PlantService: Failed to create plant:', axiosError);
            expect(consoleSpy).toHaveBeenCalledWith('❌ PlantService: Error details:', expect.any(Object));
        });
    });

    describe('updatePlant', () => {
        it('should update plant successfully', async () => {
            const plantData: ServerControllersModelsPlantDTO = {
                id: 'plant123',
                family: 'Updated Family',
                specie: 'Updated Species'
            };

            mockPlantApi.apiV1PlantsIdPut.mockResolvedValue({});

            await plantService.updatePlant('plant123', plantData);

            expect(mockPlantApi.apiV1PlantsIdPut).toHaveBeenCalledWith({
                id: 'plant123',
                serverControllersModelsPlantDTO: plantData
            });
        });
    });

    describe('deletePlant', () => {
        it('should delete plant successfully', async () => {
            mockPlantApi.apiV1PlantsIdDelete.mockResolvedValue({});

            await plantService.deletePlant('plant123');

            expect(mockPlantApi.apiV1PlantsIdDelete).toHaveBeenCalledWith({ id: 'plant123' });
        });

        it('should throw error when deletion fails', async () => {
            mockPlantApi.apiV1PlantsIdDelete.mockRejectedValue(new Error('Delete failed'));

            await expect(plantService.deletePlant('plant123')).rejects.toThrow('Delete failed');
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            localStorage.setItem('token', 'plant-service-token');

            const token = (plantService as any).getToken();
            expect(token).toBe('plant-service-token');
        });

        it('should handle missing token', () => {
            localStorage.removeItem('token');

            const token = (plantService as any).getToken();
            expect(token).toBeNull();
        });
    });

    describe('interceptors', () => {
        it('should handle request errors', async () => {
            // This tests the interceptor error handling
            const consoleSpy = vi.spyOn(console, 'error');

            // Simulate request error in interceptor
            const mockError = new Error('Request failed');
            mockPlantApi.apiV1PlantsGet.mockRejectedValue(mockError);

            await expect(plantService.getPlants()).rejects.toThrow();

            expect(consoleSpy).toHaveBeenCalledWith('❌ PlantService request error:', mockError);
        });
    });
});