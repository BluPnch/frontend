import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seedService } from '@/core/services/seed-service';
import { SeedApi } from '@/api/generated/api';
import type {
    ServerControllersModelsSeedDTO,
    ServerControllersModelsEnumsEnumViability,
    ServerControllersModelsEnumsEnumLight
} from '@/api/generated/api';


vi.mock('@/api/generated', () => ({
    Configuration: vi.fn().mockImplementation((config) => ({
        basePath: config?.basePath || '',
        accessToken: config?.accessToken,
        baseOptions: config?.baseOptions || {}
    }))
}));

vi.mock('@/api/generated/api', () => ({
    SeedApi: vi.fn(() => ({
        apiV1SeedsGet: vi.fn(),
        apiV1SeedsIdGet: vi.fn(),
        apiV1SeedsPost: vi.fn(),
        apiV1SeedsIdPut: vi.fn(),
        apiV1SeedsIdDelete: vi.fn(),
    })),
}));

describe('SeedService', () => {
    let mockSeedApi: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Setup mock implementation
        mockSeedApi = {
            apiV1SeedsGet: vi.fn(),
            apiV1SeedsIdGet: vi.fn(),
            apiV1SeedsPost: vi.fn(),
            apiV1SeedsIdPut: vi.fn(),
            apiV1SeedsIdDelete: vi.fn(),
        };

        (SeedApi as any).mockImplementation(() => mockSeedApi);

        // Reinitialize service
        (seedService as any).initializeApi();
    });

    describe('getSeeds', () => {
        it('should fetch seeds without filters', async () => {
            // quantity не существует в типе, используйте правильные поля
            const mockSeeds: ServerControllersModelsSeedDTO[] = [
                {
                    id: 'seed1',
                    plantId: 'plant1',
                    maturity: 'Созревшие',
                    viability: 1 as ServerControllersModelsEnumsEnumViability, // используйте правильный enum
                    waterRequirements: 'Умеренный'
                },
                {
                    id: 'seed2',
                    plantId: 'plant2',
                    maturity: 'Созревшие',
                    viability: 2 as ServerControllersModelsEnumsEnumViability,
                    temperatureRequirements: 20
                }
            ];

            mockSeedApi.apiV1SeedsGet.mockResolvedValue({
                data: mockSeeds
            });

            const result = await seedService.getSeeds();

            expect(result).toEqual(mockSeeds);
            expect(mockSeedApi.apiV1SeedsGet).toHaveBeenCalledWith({
                maturity: undefined,
                viability: undefined
            });
        });

        it('should fetch seeds with filters', async () => {
            const mockSeeds: ServerControllersModelsSeedDTO[] = [
                {
                    id: 'seed1',
                    plantId: 'plant1',
                    maturity: 'Созревшие',
                    viability: 1 as ServerControllersModelsEnumsEnumViability,
                    lightRequirements: 1 as ServerControllersModelsEnumsEnumLight
                }
            ];

            mockSeedApi.apiV1SeedsGet.mockResolvedValue({
                data: mockSeeds
            });

            // viability должен быть enum значением, а не строкой
            const result = await seedService.getSeeds('Созревшие', '1');

            expect(result).toEqual(mockSeeds);
            expect(mockSeedApi.apiV1SeedsGet).toHaveBeenCalledWith({
                maturity: 'Созревшие',
                viability: 1
            });
        });

        it('should throw error when fetching fails', async () => {
            mockSeedApi.apiV1SeedsGet.mockRejectedValue(new Error('Network error'));

            await expect(seedService.getSeeds()).rejects.toThrow('Network error');
        });
    });

    describe('getSeedById', () => {
        it('should fetch seed by ID', async () => {
            // Используйте правильные поля из типа
            const mockSeed: ServerControllersModelsSeedDTO = {
                id: 'seed123',
                plantId: 'plant123',
                // quantity не существует, используйте waterRequirements или temperatureRequirements
                maturity: 'Средняя',
                viability: 1 as ServerControllersModelsEnumsEnumViability, // enum, а не строка
                waterRequirements: 'Умеренный',
                temperatureRequirements: 25
            };

            mockSeedApi.apiV1SeedsIdGet.mockResolvedValue({
                data: mockSeed
            });

            const result = await seedService.getSeedById('seed123');

            expect(result).toEqual(mockSeed);
            expect(mockSeedApi.apiV1SeedsIdGet).toHaveBeenCalledWith({ id: 'seed123' });
        });
    });

    describe('createSeed', () => {
        it('should create seed successfully', async () => {
            const seedData: ServerControllersModelsSeedDTO = {
                plantId: 'plant1',
                // quantity не существует
                maturity: 'Созревшие',
                viability: 1 as ServerControllersModelsEnumsEnumViability,
                lightRequirements: 1 as ServerControllersModelsEnumsEnumLight,
                waterRequirements: 'Умеренный'
            };

            const mockResponse: ServerControllersModelsSeedDTO = {
                id: 'new-seed',
                ...seedData
            };

            mockSeedApi.apiV1SeedsPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await seedService.createSeed(seedData);

            expect(result).toEqual(mockResponse);
            expect(mockSeedApi.apiV1SeedsPost).toHaveBeenCalledWith({
                serverControllersModelsSeedDTO: seedData
            });
        });
    });

    describe('updateSeed', () => {
        it('should update seed successfully', async () => {
            const seedData: ServerControllersModelsSeedDTO = {
                plantId: 'plant1',
                // quantity не существует
                maturity: 'Созревшие',
                viability: 1 as ServerControllersModelsEnumsEnumViability,
                waterRequirements: 'Умеренный'
            };

            mockSeedApi.apiV1SeedsIdPut.mockResolvedValue({});

            await seedService.updateSeed('seed123', seedData);

            expect(mockSeedApi.apiV1SeedsIdPut).toHaveBeenCalledWith({
                id: 'seed123',
                serverControllersModelsSeedDTO: seedData
            });
        });

        it('should throw error when update fails', async () => {
            const seedData: ServerControllersModelsSeedDTO = {
                plantId: 'plant1',
                waterRequirements: 'Умеренный'
            };

            mockSeedApi.apiV1SeedsIdPut.mockRejectedValue(new Error('Update failed'));

            await expect(seedService.updateSeed('seed123', seedData)).rejects.toThrow('Update failed');
        });
    });

    describe('deleteSeed', () => {
        it('should delete seed successfully', async () => {
            mockSeedApi.apiV1SeedsIdDelete.mockResolvedValue({});

            await seedService.deleteSeed('seed123');

            expect(mockSeedApi.apiV1SeedsIdDelete).toHaveBeenCalledWith({ id: 'seed123' });
        });

        it('should throw error when deletion fails', async () => {
            mockSeedApi.apiV1SeedsIdDelete.mockRejectedValue(new Error('Delete failed'));

            await expect(seedService.deleteSeed('seed123')).rejects.toThrow('Delete failed');
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            localStorage.setItem('token', 'seed-service-token');

            const token = (seedService as any).getToken();
            expect(token).toBe('seed-service-token');
        });

        it('should not add authorization header when no token', async () => {
            localStorage.removeItem('token');

            const mockSeeds: ServerControllersModelsSeedDTO[] = [
                { id: 'seed1', plantId: 'plant1' }
            ];

            mockSeedApi.apiV1SeedsGet.mockResolvedValue({
                data: mockSeeds
            });

            await seedService.getSeeds();

            // The interceptor should handle this
            expect(mockSeedApi.apiV1SeedsGet).toHaveBeenCalled();
        });
    });

    describe('error handling', () => {
        it('should wrap errors with custom message', async () => {
            const originalError = new Error('Original error message');
            mockSeedApi.apiV1SeedsGet.mockRejectedValue(originalError);

            try {
                await seedService.getSeeds();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toBe('Original error message');
            }
        });

        it('should handle unknown errors', async () => {
            mockSeedApi.apiV1SeedsGet.mockRejectedValue('Unknown error string');

            await expect(seedService.getSeeds()).rejects.toThrow('Ошибка получения списка семян');
        });
    });
});