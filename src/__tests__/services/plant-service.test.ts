import { plantService } from '../../core/services/plant-service';

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});


jest.mock('../../api/generated/api', () => ({
    PlantApi: jest.fn().mockImplementation(() => ({
        apiV1PlantsGet: jest.fn(),
        apiV1PlantsIdGet: jest.fn(),
        apiV1PlantsPost: jest.fn(),
        apiV1PlantsIdPut: jest.fn(),
        apiV1PlantsIdDelete: jest.fn(),
    })),
}));


jest.mock('../../api/api-client', () => ({
    createApiConfiguration: jest.fn(() => ({})),
}));

describe('PlantService', () => {
    let mockApiInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('test-token');

        mockApiInstance = (plantService as any).plantApi;
    });

    describe('getPlants', () => {
        it('должен вызывать API метод для получения растений', async () => {
            // Arrange
            const mockResponse = { data: [{ id: '1', specie: 'Tomato' }] };
            const mockApiInstance = (plantService as any).plantApi;
            mockApiInstance.apiV1PlantsGet.mockResolvedValue(mockResponse);

            // Act
            const result = await plantService.getPlants('Solanaceae', 'Tomato');

            // Assert
            expect(mockApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                family: 'Solanaceae',
                species: 'Tomato',
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('должен обрабатывать ошибки', async () => {
            // Arrange
            const mockApiInstance = (plantService as any).plantApi;
            mockApiInstance.apiV1PlantsGet.mockRejectedValue(new Error('Network error'));

            // Act & Assert
            await expect(plantService.getPlants()).rejects.toThrow('Network error');
        });

        it('должен обрабатывать не-Error объекты', async () => {
            // Arrange
            const mockApiInstance = (plantService as any).plantApi;
            mockApiInstance.apiV1PlantsGet.mockRejectedValue('Просто строка ошибки');

            // Act & Assert
            await expect(plantService.getPlants()).rejects.toThrow('Ошибка получения списка растений');
        });
    });

    describe('getPlantById', () => {
        it('должен вызывать API метод для получения растения по ID', async () => {
            // Arrange
            const mockResponse = { data: { id: '1', specie: 'Tomato' } };
            mockApiInstance.apiV1PlantsIdGet.mockResolvedValue(mockResponse);

            // Act
            const result = await plantService.getPlantById('1');

            // Assert
            expect(mockApiInstance.apiV1PlantsIdGet).toHaveBeenCalledWith({
                id: '1',
            });
            expect(result).toEqual(mockResponse.data);
        });
    });
});