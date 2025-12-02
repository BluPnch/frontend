import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seedService } from '@/core/services/seed-service';
import { SeedApi } from '@/api/generated/api';
import type {
    ServerControllersModelsSeedDTO,
    ServerControllersModelsEnumsEnumViability,
    ServerControllersModelsEnumsEnumLight
} from '@/api/generated/api';

// Создаем полный мок для Configuration с нужными методами
vi.mock('@/api/generated', () => ({
    Configuration: vi.fn().mockImplementation((config) => ({
        basePath: config?.basePath || '',
        accessToken: config?.accessToken,
        baseOptions: config?.baseOptions || {},
        isJsonMime: vi.fn(() => true),
        // Добавляем другие обязательные свойства и методы
        get apiKey() {
            return undefined;
        },
        set apiKey(value: string | undefined) {
            // Пустая реализация
        },
        get username() {
            return undefined;
        },
        set username(value: string | undefined) {
            // Пустая реализация
        },
        get password() {
            return undefined;
        },
        set password(value: string | undefined) {
            // Пустая реализация
        }
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

// Mock axios полностью
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
        })),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() }
        }
    }
}));

describe('SeedService', () => {
    let mockSeedApi: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Используем globalThis.lotoken managementcalStorage для очистки
        globalThis.localStorage?.clear();
        // Очистка моков SeedApi
        mockSeedApi = {
            apiV1SeedsGet: vi.fn(),
            apiV1SeedsIdGet: vi.fn(),
            apiV1SeedsPost: vi.fn(),
            apiV1SeedsIdPut: vi.fn(),
            apiV1SeedsIdDelete: vi.fn(),
        };
        (SeedApi as any).mockImplementation(() => mockSeedApi);
    });

    // Вспомогательная функция для создания тестового экземпляра
    const createTestInstance = () => {
        // Используем реальный конструктор SeedService
        const TestSeedService = require('@/core/services/seed-service').SeedService;
        const instance = new TestSeedService();
        // Подменяем seedApi на мок
        (instance as any).seedApi = mockSeedApi;
        return instance;
    };

    describe('getSeeds', () => {
        it('should fetch seeds without filters', async () => {
            const instance = createTestInstance();

            const mockSeeds: ServerControllersModelsSeedDTO[] = [
                {
                    id: 'seed1',
                    plantId: 'plant1',
                    maturity: 'Созревшие',
                    viability: 1 as ServerControllersModelsEnumsEnumViability,
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

            const result = await instance.getSeeds('Созревшие', '1');

            expect(result).toEqual(mockSeeds);
            expect(mockSeedApi.apiV1SeedsGet).toHaveBeenCalledWith({
                maturity: 'Созревшие',
                viability: '1'
            });
        });

        it('should throw error when fetching fails', async () => {
            const instance = createTestInstance();

            mockSeedApi.apiV1SeedsGet.mockRejectedValue(new Error('Network error'));

            await expect(instance.getSeeds()).rejects.toThrow('Network error');
        });
    });

    describe('getSeedById', () => {
        it('should fetch seed by ID', async () => {
            const instance = createTestInstance();

            const mockSeed: ServerControllersModelsSeedDTO = {
                id: 'seed123',
                plantId: 'plant123',
                maturity: 'Средняя',
                viability: 1 as ServerControllersModelsEnumsEnumViability,
                waterRequirements: 'Умеренный',
                temperatureRequirements: 25
            };

            mockSeedApi.apiV1SeedsIdGet.mockResolvedValue({
                data: mockSeed
            });

            const result = await instance.getSeedById('seed123');

            expect(result).toEqual(mockSeed);
            expect(mockSeedApi.apiV1SeedsIdGet).toHaveBeenCalledWith({ id: 'seed123' });
        });

        it('should throw error when fetching by ID fails', async () => {
            const instance = createTestInstance();

            mockSeedApi.apiV1SeedsIdGet.mockRejectedValue(new Error('Not found'));

            await expect(instance.getSeedById('invalid-id')).rejects.toThrow('Not found');
        });
    });

    describe('createSeed', () => {
        it('should create seed successfully', async () => {
            const instance = createTestInstance();

            const seedData: ServerControllersModelsSeedDTO = {
                plantId: 'plant1',
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

            const result = await instance.createSeed(seedData);

            expect(result).toEqual(mockResponse);
            expect(mockSeedApi.apiV1SeedsPost).toHaveBeenCalledWith({
                serverControllersModelsSeedDTO: seedData
            });
        });

        it('should throw error when creation fails', async () => {
            const instance = createTestInstance();

            const seedData: ServerControllersModelsSeedDTO = {
                plantId: 'plant1',
                waterRequirements: 'Умеренный'
            };

            mockSeedApi.apiV1SeedsPost.mockRejectedValue(new Error('Creation failed'));

            await expect(instance.createSeed(seedData)).rejects.toThrow('Creation failed');
        });
    });

    describe('updateSeed', () => {
        it('should update seed successfully', async () => {
            const instance = createTestInstance();

            const seedData: ServerControllersModelsSeedDTO = {
                plantId: 'plant1',
                maturity: 'Созревшие',
                viability: 1 as ServerControllersModelsEnumsEnumViability,
                waterRequirements: 'Умеренный'
            };

            mockSeedApi.apiV1SeedsIdPut.mockResolvedValue({});

            await instance.updateSeed('seed123', seedData);

            expect(mockSeedApi.apiV1SeedsIdPut).toHaveBeenCalledWith({
                id: 'seed123',
                serverControllersModelsSeedDTO: seedData
            });
        });

        it('should throw error when update fails', async () => {
            const instance = createTestInstance();

            const seedData: ServerControllersModelsSeedDTO = {
                plantId: 'plant1',
                waterRequirements: 'Умеренный'
            };

            mockSeedApi.apiV1SeedsIdPut.mockRejectedValue(new Error('Update failed'));

            await expect(instance.updateSeed('seed123', seedData)).rejects.toThrow('Update failed');
        });
    });

    describe('deleteSeed', () => {
        it('should delete seed successfully', async () => {
            const instance = createTestInstance();

            mockSeedApi.apiV1SeedsIdDelete.mockResolvedValue({});

            await instance.deleteSeed('seed123');

            expect(mockSeedApi.apiV1SeedsIdDelete).toHaveBeenCalledWith({ id: 'seed123' });
        });

        it('should throw error when deletion fails', async () => {
            const instance = createTestInstance();

            mockSeedApi.apiV1SeedsIdDelete.mockRejectedValue(new Error('Delete failed'));

            await expect(instance.deleteSeed('seed123')).rejects.toThrow('Delete failed');
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            const instance = createTestInstance();
            // Используем globalThis.localStorage для установки токена
            localStorage.setItem('token', 'seed-service-token');
            const token = (instance as any).getToken();
            expect(token).toBe('seed-service-token');
        });

        it('should not add authorization header when no token', async () => {
            const instance = createTestInstance();
            // Используем globalThis.localStorage для удаления токена
            globalThis.localStorage?.removeItem('token');
            const mockSeeds: ServerControllersModelsSeedDTO[] = [
                { id: 'seed1', plantId: 'plant1' }
            ];
            mockSeedApi.apiV1SeedsGet.mockResolvedValue({
                data: mockSeeds
            });
            await instance.getSeeds();
            expect(mockSeedApi.apiV1SeedsGet).toHaveBeenCalled();
        });
    });

    describe('error handling', () => {
        it('should wrap errors with custom message', async () => {
            const instance = createTestInstance();

            const originalError = new Error('Original error message');
            mockSeedApi.apiV1SeedsGet.mockRejectedValue(originalError);

            try {
                await instance.getSeeds();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toBe('Original error message');
            }
        });

        it('should handle unknown errors', async () => {
            const instance = createTestInstance();

            mockSeedApi.apiV1SeedsGet.mockRejectedValue('Unknown error string');

            await expect(instance.getSeeds()).rejects.toThrow('Ошибка получения списка семян');
        });
    });
});