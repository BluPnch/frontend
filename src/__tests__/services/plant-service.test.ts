import { plantService } from '../../core/services/plant-service';
import {
    mockPlantDTO,
    mockPlantsDTO,
    mockApiResponse,
    mockErrorResponses,
    TEST_CONSTANTS
} from '../mocks/plant-mocks';

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
    PlantApi: jest.fn().mockImplementation(() => ({
        apiV1PlantsGet: jest.fn(),
        apiV1PlantsIdGet: jest.fn(),
        apiV1PlantsPost: jest.fn(),
        apiV1PlantsIdPut: jest.fn(),
        apiV1PlantsIdDelete: jest.fn(),
    })),
}));

// Мок для createApiConfiguration
jest.mock('../../api/api-client', () => ({
    createApiConfiguration: jest.fn(() => ({})),
}));

describe('PlantService', () => {
    let mockApiInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(TEST_CONSTANTS.TOKEN);

        mockApiInstance = (plantService as any).plantApi;
    });

    describe('Инициализация', () => {
        it('должен инициализировать API клиент', () => {
            expect(mockApiInstance).toBeDefined();
        });

        it('должен предоставлять все публичные методы', () => {
            expect(typeof plantService.getPlants).toBe('function');
            expect(typeof plantService.getPlantById).toBe('function');
            expect(typeof plantService.createPlant).toBe('function');
            expect(typeof plantService.updatePlant).toBe('function');
            expect(typeof plantService.deletePlant).toBe('function');
        });
    });

    describe('getPlants', () => {
        it('должен получать все растения без фильтров', async () => {
            // Arrange
            mockApiInstance.apiV1PlantsGet.mockResolvedValue(mockApiResponse(mockPlantsDTO));

            // Act
            const result = await plantService.getPlants();

            // Assert
            expect(mockApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({});
            expect(result).toEqual(mockPlantsDTO);
            expect(result).toHaveLength(4);
        });

        it('должен фильтровать растения по семейству', async () => {
            // Arrange
            const filteredPlants = mockPlantsDTO.filter(p => p.family === 'Solanaceae');
            mockApiInstance.apiV1PlantsGet.mockResolvedValue(mockApiResponse(filteredPlants));

            // Act
            const result = await plantService.getPlants('Solanaceae');

            // Assert
            expect(mockApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                family: 'Solanaceae',
            });
            expect(result).toHaveLength(2);
            expect(result[0].family).toBe('Solanaceae');
        });

        it('должен обрабатывать 404 ошибку', async () => {
            // Arrange
            const error = mockErrorResponses.notFound;
            mockApiInstance.apiV1PlantsGet.mockRejectedValue(error);

            // Act & Assert
            // Ожидаем 'Plant not found' потому что error.response.data.message = 'Plant not found'
            // и error instanceof Error будет true (так как error - это объект с response)
            await expect(plantService.getPlants()).rejects.toThrow('Plant not found');
        });

        it('должен обрабатывать сетевую ошибку', async () => {
            // Arrange
            mockApiInstance.apiV1PlantsGet.mockRejectedValue(new Error('Network error'));

            // Act & Assert
            await expect(plantService.getPlants()).rejects.toThrow('Network error');
        });

        it('должен обрабатывать не-Error объекты', async () => {
            // Arrange
            mockApiInstance.apiV1PlantsGet.mockRejectedValue('Просто строка ошибки');

            // Act & Assert
            // 'Просто строка ошибки' не является экземпляром Error, поэтому будет 'Ошибка получения списка растений'
            await expect(plantService.getPlants()).rejects.toThrow('Ошибка получения списка растений');
        });
    });

    describe('getPlantById', () => {
        it('должен получать растение по ID', async () => {
            // Arrange
            const plantId = 'plant-1';
            mockApiInstance.apiV1PlantsIdGet.mockResolvedValue(mockApiResponse(mockPlantDTO));

            // Act
            const result = await plantService.getPlantById(plantId);

            // Assert
            expect(mockApiInstance.apiV1PlantsIdGet).toHaveBeenCalledWith({
                id: plantId,
            });
            expect(result).toEqual(mockPlantDTO);
            expect(result.id).toBe(plantId);
        });

        it('должен обрабатывать ошибку при получении несуществующего растения', async () => {
            // Arrange
            const error = mockErrorResponses.notFound;
            mockApiInstance.apiV1PlantsIdGet.mockRejectedValue(error);

            // Act & Assert
            await expect(plantService.getPlantById('non-existent-id')).rejects.toThrow('Plant not found');
        });
    });

    describe('createPlant', () => {
        it('должен создавать новое растение', async () => {
            // Arrange
            const newPlantDTO = { ...mockPlantDTO, id: undefined };
            const createdPlantDTO = { ...newPlantDTO, id: 'new-plant-id' };
            mockApiInstance.apiV1PlantsPost.mockResolvedValue(mockApiResponse(createdPlantDTO));

            // Act
            const result = await plantService.createPlant(newPlantDTO);

            // Assert
            expect(mockApiInstance.apiV1PlantsPost).toHaveBeenCalledWith({
                serverControllersModelsPlantDTO: newPlantDTO,
            });
            expect(result).toEqual(createdPlantDTO);
            expect(result.id).toBe('new-plant-id');
        });

        it('должен обрабатывать ошибку валидации при создании', async () => {
            // Arrange
            const invalidPlant = { specie: '' } as any;
            const error = mockErrorResponses.validation;
            mockApiInstance.apiV1PlantsPost.mockRejectedValue(error);

            // Act & Assert
            await expect(plantService.createPlant(invalidPlant)).rejects.toThrow();
        });
    });

    describe('updatePlant', () => {
        it('должен обновлять существующее растение', async () => {
            // Arrange
            const plantId = 'plant-1';
            const updatedPlantDTO = { ...mockPlantDTO, specie: 'Updated Species' };
            mockApiInstance.apiV1PlantsIdPut.mockResolvedValue({});

            // Act
            await plantService.updatePlant(plantId, updatedPlantDTO);

            // Assert
            expect(mockApiInstance.apiV1PlantsIdPut).toHaveBeenCalledWith({
                id: plantId,
                serverControllersModelsPlantDTO: updatedPlantDTO,
            });
        });

        it('должен обрабатывать ошибку при обновлении несуществующего растения', async () => {
            // Arrange
            const error = mockErrorResponses.notFound;
            mockApiInstance.apiV1PlantsIdPut.mockRejectedValue(error);

            // Act & Assert
            await expect(
                plantService.updatePlant('non-existent-id', mockPlantDTO)
            ).rejects.toThrow('Plant not found');
        });
    });

    describe('deletePlant', () => {
        it('должен удалять растение', async () => {
            // Arrange
            const plantId = 'plant-1';
            mockApiInstance.apiV1PlantsIdDelete.mockResolvedValue({});

            // Act
            await plantService.deletePlant(plantId);

            // Assert
            expect(mockApiInstance.apiV1PlantsIdDelete).toHaveBeenCalledWith({
                id: plantId,
            });
        });

        it('должен обрабатывать ошибку при удалении несуществующего растения', async () => {
            // Arrange
            const error = mockErrorResponses.notFound;
            mockApiInstance.apiV1PlantsIdDelete.mockRejectedValue(error);

            // Act & Assert
            await expect(plantService.deletePlant('non-existent-id')).rejects.toThrow('Plant not found');
        });
    });
});