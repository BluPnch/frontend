import { seedService } from '../../core/services/seed-service';
import {
    mockSeedDTO,
    mockSeedsDTO,
    createSeedDTO,
    VIABILITY_ENUM,
    LIGHT_ENUM,
    toViabilityEnum,
    toLightEnum,
    SEED_TEST_CONSTANTS
} from '../mocks/seed-mocks';
import { mockApiResponse, createMockError, mockNetworkError } from '../mocks/api-mocks';
import type {ServerControllersModelsSeedDTO} from "../../api/generated";


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
    SeedApi: jest.fn().mockImplementation(() => ({
        apiV1SeedsGet: jest.fn(),
        apiV1SeedsIdGet: jest.fn(),
        apiV1SeedsPost: jest.fn(),
        apiV1SeedsIdPut: jest.fn(),
        apiV1SeedsIdDelete: jest.fn(),
    })),
}));

// Мок для createApiConfiguration
jest.mock('../../api/api-client', () => ({
    createApiConfiguration: jest.fn(() => ({})),
}));

describe('SeedService', () => {
    let mockApiInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(SEED_TEST_CONSTANTS.TOKEN);

        mockApiInstance = (seedService as any).seedApi;
    });

    describe('Инициализация', () => {
        it('должен инициализировать API клиент', () => {
            expect(mockApiInstance).toBeDefined();
        });

        it('должен предоставлять все публичные методы', () => {
            expect(typeof seedService.getSeeds).toBe('function');
            expect(typeof seedService.getSeedById).toBe('function');
            expect(typeof seedService.createSeed).toBe('function');
            expect(typeof seedService.updateSeed).toBe('function');
            expect(typeof seedService.deleteSeed).toBe('function');
        });
    });

    describe('getSeeds', () => {
        it('должен получать все семена без фильтров', async () => {
            // Arrange
            mockApiInstance.apiV1SeedsGet.mockResolvedValue(mockApiResponse(mockSeedsDTO));

            // Act
            const result = await seedService.getSeeds();

            // Assert
            expect(mockApiInstance.apiV1SeedsGet).toHaveBeenCalledWith({});
            expect(result).toEqual(mockSeedsDTO);
            expect(result).toHaveLength(4);
        });

        it('должен фильтровать семена по зрелости', async () => {
            // Arrange
            const filteredSeeds = mockSeedsDTO.filter(s => s.maturity === 'MATURE');
            mockApiInstance.apiV1SeedsGet.mockResolvedValue(mockApiResponse(filteredSeeds));

            // Act
            const result = await seedService.getSeeds('MATURE');

            // Assert
            expect(mockApiInstance.apiV1SeedsGet).toHaveBeenCalledWith({
                maturity: 'MATURE',
            });
            expect(result).toHaveLength(2);
            expect(result[0].maturity).toBe('MATURE');
            expect(result[1].maturity).toBe('MATURE');
        });

        it('должен фильтровать семена по жизнеспособности', async () => {
            // Arrange
            // Note: viability передаётся как string, согласно интерфейсу
            const filteredSeeds = mockSeedsDTO; // API сам фильтрует
            mockApiInstance.apiV1SeedsGet.mockResolvedValue(mockApiResponse(filteredSeeds));

            // Act
            const result = await seedService.getSeeds(undefined, 'HIGH');

            // Assert
            expect(mockApiInstance.apiV1SeedsGet).toHaveBeenCalledWith({
                viability: 'HIGH',
            });
            // Проверяем, что API был вызван с правильными параметрами
            expect(mockApiInstance.apiV1SeedsGet).toHaveBeenCalledWith(
                expect.objectContaining({ viability: 'HIGH' })
            );
        });

        it('должен фильтровать семена по зрелости и жизнеспособности', async () => {
            // Arrange
            const filteredSeeds = mockSeedsDTO.filter(s =>
                    s.maturity === 'MATURE'
                // viability фильтрация на стороне API
            );
            mockApiInstance.apiV1SeedsGet.mockResolvedValue(mockApiResponse(filteredSeeds));

            // Act
            const result = await seedService.getSeeds('MATURE', '90');

            // Assert
            expect(mockApiInstance.apiV1SeedsGet).toHaveBeenCalledWith({
                maturity: 'MATURE',
                viability: '90',
            });
        });

        it('должен обрабатывать 404 ошибку при получении семян', async () => {
            // Arrange
            const error = createMockError('Seeds not found', 404);
            mockApiInstance.apiV1SeedsGet.mockRejectedValue(error);

            // Act & Assert
            await expect(seedService.getSeeds()).rejects.toThrow('Seeds not found');
        });

        it('должен обрабатывать сетевую ошибку', async () => {
            // Arrange
            mockApiInstance.apiV1SeedsGet.mockRejectedValue(mockNetworkError());

            // Act & Assert
            await expect(seedService.getSeeds()).rejects.toThrow('Network Error');
        });

        it('должен обрабатывать не-Error объекты', async () => {
            // Arrange
            mockApiInstance.apiV1SeedsGet.mockRejectedValue('Просто строка ошибки');

            // Act & Assert
            await expect(seedService.getSeeds()).rejects.toThrow('Ошибка получения списка семян');
        });
    });

    describe('getSeedById', () => {
        it('должен получать семя по ID', async () => {
            // Arrange
            const seedId = 'seed-1';
            mockApiInstance.apiV1SeedsIdGet.mockResolvedValue(mockApiResponse(mockSeedDTO));

            // Act
            const result = await seedService.getSeedById(seedId);

            // Assert
            expect(mockApiInstance.apiV1SeedsIdGet).toHaveBeenCalledWith({
                id: seedId,
            });
            expect(result).toEqual(mockSeedDTO);
            expect(result.id).toBe(seedId);
            expect(result.maturity).toBe('MATURE');
            expect(result.viability).toBe(95);
        });

        it('должен обрабатывать ошибку при получении несуществующего семени', async () => {
            // Arrange
            const error = createMockError('Seed not found', 404);
            mockApiInstance.apiV1SeedsIdGet.mockRejectedValue(error);

            // Act & Assert
            await expect(seedService.getSeedById('non-existent-id')).rejects.toThrow('Seed not found');
        });

        it('должен обрабатывать ошибку сервера при получении семени', async () => {
            // Arrange
            const error = createMockError('Internal Server Error', 500);
            mockApiInstance.apiV1SeedsIdGet.mockRejectedValue(error);

            // Act & Assert
            await expect(seedService.getSeedById('some-id')).rejects.toThrow('Internal Server Error');
        });
    });

    describe('createSeed', () => {
        it('должен создавать новое семя', async () => {
            // Arrange
            const newSeedDTO = createSeedDTO({ id: undefined });
            const createdSeedDTO = { ...newSeedDTO, id: 'new-seed-id' };
            mockApiInstance.apiV1SeedsPost.mockResolvedValue(mockApiResponse(createdSeedDTO));

            // Act
            const result = await seedService.createSeed(newSeedDTO);

            // Assert
            expect(mockApiInstance.apiV1SeedsPost).toHaveBeenCalledWith({
                serverControllersModelsSeedDTO: newSeedDTO,
            });
            expect(result).toEqual(createdSeedDTO);
            expect(result.id).toBe('new-seed-id');
            expect(result.plantId).toBe(newSeedDTO.plantId);
        });

        it('должен обрабатывать ошибку валидации при создании семени', async () => {
            // Arrange
            const invalidSeed = { plantId: '' } as any;
            const error = createMockError('Plant ID is required', 400);
            mockApiInstance.apiV1SeedsPost.mockRejectedValue(error);

            // Act & Assert
            await expect(seedService.createSeed(invalidSeed)).rejects.toThrow('Plant ID is required');
        });

        it('должен обрабатывать ошибку дубликата при создании', async () => {
            // Arrange
            const duplicateSeed = createSeedDTO();
            const error = createMockError('Seed already exists', 409);
            mockApiInstance.apiV1SeedsPost.mockRejectedValue(error);

            // Act & Assert
            await expect(seedService.createSeed(duplicateSeed)).rejects.toThrow('Seed already exists');
        });
    });

    describe('updateSeed', () => {
        it('должен обновлять существующее семя', async () => {
            // Arrange
            const seedId = 'seed-1';
            const updatedSeedDTO: ServerControllersModelsSeedDTO = {
                ...mockSeedDTO,
                viability: toViabilityEnum(96), // Используем enum
                maturity: 'GERMINATED'
            };
            mockApiInstance.apiV1SeedsIdPut.mockResolvedValue({});

            // Act
            await seedService.updateSeed(seedId, updatedSeedDTO);

            // Assert
            expect(mockApiInstance.apiV1SeedsIdPut).toHaveBeenCalledWith({
                id: seedId,
                serverControllersModelsSeedDTO: updatedSeedDTO,
            });
        });

        it('должен обрабатывать ошибку при обновлении несуществующего семени', async () => {
            // Arrange
            const error = createMockError('Seed not found', 404);
            mockApiInstance.apiV1SeedsIdPut.mockRejectedValue(error);

            // Act & Assert
            await expect(
                seedService.updateSeed('non-existent-id', mockSeedDTO)
            ).rejects.toThrow('Seed not found');
        });

        it('должен обрабатывать ошибку валидации при обновлении', async () => {
            // Arrange
            const invalidSeed: ServerControllersModelsSeedDTO = {
                ...mockSeedDTO,
                viability: toViabilityEnum(-5) // Некорректное значение
            };
            const error = createMockError('Viability must be between 0 and 100', 400);
            mockApiInstance.apiV1SeedsIdPut.mockRejectedValue(error);

            // Act & Assert
            await expect(
                seedService.updateSeed('seed-1', invalidSeed)
            ).rejects.toThrow('Viability must be between 0 and 100');
        });
    });

    describe('deleteSeed', () => {
        it('должен удалять семя', async () => {
            // Arrange
            const seedId = 'seed-1';
            mockApiInstance.apiV1SeedsIdDelete.mockResolvedValue({});

            // Act
            await seedService.deleteSeed(seedId);

            // Assert
            expect(mockApiInstance.apiV1SeedsIdDelete).toHaveBeenCalledWith({
                id: seedId,
            });
        });

        it('должен обрабатывать ошибку при удалении несуществующего семени', async () => {
            // Arrange
            const error = createMockError('Seed not found', 404);
            mockApiInstance.apiV1SeedsIdDelete.mockRejectedValue(error);

            // Act & Assert
            await expect(seedService.deleteSeed('non-existent-id')).rejects.toThrow('Seed not found');
        });

        it('должен обрабатывать ошибку при удалении семени с зависимостями', async () => {
            // Arrange
            const error = createMockError('Cannot delete seed with related records', 409);
            mockApiInstance.apiV1SeedsIdDelete.mockRejectedValue(error);

            // Act & Assert
            await expect(seedService.deleteSeed('seed-with-deps')).rejects.toThrow('Cannot delete seed with related records');
        });
    });

    describe('Обработка граничных случаев', () => {
        it('должен сохранять все поля при создании и обновлении', async () => {
            // Arrange
            const completeSeed: ServerControllersModelsSeedDTO = {
                id: 'complete-seed',
                plantId: 'plant-1',
                maturity: 'DORMANT',
                viability: toViabilityEnum(30),
                lightRequirements: toLightEnum(2),
                waterRequirements: 'LOW',
                temperatureRequirements: 15,
            };

            mockApiInstance.apiV1SeedsPost.mockResolvedValue(mockApiResponse(completeSeed));

            // Act
            const result = await seedService.createSeed(completeSeed);

            // Assert
            expect(result).toEqual(completeSeed);
            expect(result.viability).toBe(30);
            expect(result.lightRequirements).toBe(2);
            expect(result.temperatureRequirements).toBe(15);
            expect(result.waterRequirements).toBe('LOW');
        });
    });
});