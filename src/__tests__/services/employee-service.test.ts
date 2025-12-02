import { employeeService } from '../../core/services/employee-service';
import type {
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsPlantDTO,
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsGrowthStageDTO,
    ServerControllersModelsUserDTO
} from '../../api/generated/api';
import {
    mockApiResponse,
    createMockError,
    mockNetworkError
} from '../mocks/api-mocks';

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
    EmployeeApi: jest.fn().mockImplementation(() => ({
        apiV1EmployeesIdGet: jest.fn(),
        apiV1EmployeesPlantsGet: jest.fn(),
        apiV1EmployeesGet: jest.fn(),
    })),
    PlantApi: jest.fn().mockImplementation(() => ({
        apiV1PlantsGet: jest.fn(),
        apiV1PlantsIdGet: jest.fn(),
        apiV1PlantsIdPut: jest.fn(),
    })),
    JournalRecordApi: jest.fn().mockImplementation(() => ({
        apiV1JournalRecordsGet: jest.fn(),
        apiV1JournalRecordsIdGet: jest.fn(),
        apiV1JournalRecordsPost: jest.fn(),
        apiV1JournalRecordsIdPut: jest.fn(),
        apiV1JournalRecordsIdDelete: jest.fn(),
    })),
    GrowthStageApi: jest.fn().mockImplementation(() => ({
        apiV1GrowthStagesGet: jest.fn(),
        apiV1GrowthStagesIdGet: jest.fn(),
    })),
    UserApi: jest.fn().mockImplementation(() => ({
        apiV1UsersMeGet: jest.fn(),
    })),
}));

// Мок для createApiConfiguration
jest.mock('../../api/api-client', () => ({
    createApiConfiguration: jest.fn(() => ({})),
}));

// Мок для axios
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: {
                use: jest.fn(),
            },
            response: {
                use: jest.fn(),
            },
        },
    })),
}));

describe('EmployeeService', () => {
    let mockEmployeeApiInstance: any;
    let mockPlantApiInstance: any;
    let mockJournalRecordApiInstance: any;
    let mockGrowthStageApiInstance: any;
    let mockUserApiInstance: any;

    const mockUserDTO: ServerControllersModelsUserDTO = {
        id: 'user-1',
        phoneNumber: '+1234567890',
    };

    const mockEmployeeDTO: ServerControllersModelsEmployeeDTO = {
        id: 'emp-1',
        surname: 'Иванов',
        name: 'Иван',
        patronymic: 'Иванович',
        phoneNumber: '+1234567890',
        task: 'gardener',
        plantDomain: 'greenhouse-1',
        administratorId: 'admin-1',
    };

    const mockPlantDTO: ServerControllersModelsPlantDTO = {
        id: 'plant-1',
        clientId: 'client-1',
        specie: 'Rosa',
        family: 'Rosaceae',
        flower: 1,
        fruit: 2,
        reproduction: 3,
    };

    const mockJournalRecordDTO: ServerControllersModelsJournalRecordDTO = {
        id: 'journal-1',
        plantId: 'plant-1',
        growthStageId: 'stage-1',
        employeeId: 'emp-1',
        plantHeight: 150,
        fruitCount: 10,
        condition: 5,
        date: '2024-12-02T10:00:00Z',
    };

    const mockGrowthStageDTO: ServerControllersModelsGrowthStageDTO = {
        id: 'stage-1',
        name: 'Vegetative',
        description: 'Vegetative growth stage',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('test-token');

        // Сброс текущего employeeId перед каждым тестом
        (employeeService as any).currentEmployeeId = null;

        // Получаем мок экземпляры API
        mockEmployeeApiInstance = (employeeService as any).employeeApi;
        mockPlantApiInstance = (employeeService as any).plantApi;
        mockJournalRecordApiInstance = (employeeService as any).journalRecordApi;
        mockGrowthStageApiInstance = (employeeService as any).growthStageApi;
        mockUserApiInstance = (employeeService as any).userApi;
    });

    describe('Инициализация', () => {
        it('должен инициализировать все API клиенты', () => {
            expect(mockEmployeeApiInstance).toBeDefined();
            expect(mockPlantApiInstance).toBeDefined();
            expect(mockJournalRecordApiInstance).toBeDefined();
            expect(mockGrowthStageApiInstance).toBeDefined();
            expect(mockUserApiInstance).toBeDefined();
        });

        it('должен предоставлять все публичные методы', () => {
            expect(typeof employeeService.getCurrentEmployeeId).toBe('function');
            expect(typeof employeeService.getMyProfile).toBe('function');
            expect(typeof employeeService.getEmployeeById).toBe('function');
            expect(typeof employeeService.getMyPlants).toBe('function');
            expect(typeof employeeService.getEmployeePlants).toBe('function');
            expect(typeof employeeService.getPlantById).toBe('function');
            expect(typeof employeeService.updatePlant).toBe('function');
            expect(typeof employeeService.getJournalRecords).toBe('function');
            expect(typeof employeeService.getJournalRecordById).toBe('function');
            expect(typeof employeeService.createJournalRecord).toBe('function');
            expect(typeof employeeService.updateJournalRecord).toBe('function');
            expect(typeof employeeService.deleteJournalRecord).toBe('function');
            expect(typeof employeeService.getGrowthStages).toBe('function');
            expect(typeof employeeService.getGrowthStageById).toBe('function');
            expect(typeof employeeService.searchPlants).toBe('function');
            expect(typeof employeeService.getEmployees).toBe('function');
        });
    });

    describe('Получение ID текущего сотрудника', () => {
        describe('getCurrentEmployeeId', () => {
            it('должен возвращать сохраненный ID сотрудника', async () => {
                // Arrange
                (employeeService as any).currentEmployeeId = 'emp-1';

                // Act
                const result = await employeeService.getCurrentEmployeeId();

                // Assert
                expect(result).toBe('emp-1');
                expect(mockUserApiInstance.apiV1UsersMeGet).not.toHaveBeenCalled();
            });

            it('должен получать ID сотрудника из профиля при первом вызове', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockUserDTO);
                mockUserApiInstance.apiV1UsersMeGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getCurrentEmployeeId();

                // Assert
                expect(mockUserApiInstance.apiV1UsersMeGet).toHaveBeenCalled();
                expect(result).toBe('user-1');
                expect((employeeService as any).currentEmployeeId).toBe('user-1');
            });

            it('должен выбрасывать ошибку если профиль не содержит ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse({ ...mockUserDTO, id: undefined });
                mockUserApiInstance.apiV1UsersMeGet.mockResolvedValue(mockResponse);

                // Act & Assert
                await expect(employeeService.getCurrentEmployeeId()).rejects.toThrow('Не удалось определить ID сотрудника');
            });

            it('должен обрабатывать ошибки при получении профиля', async () => {
                // Arrange
                mockUserApiInstance.apiV1UsersMeGet.mockRejectedValue(new Error('Network error'));

                // Act & Assert
                await expect(employeeService.getCurrentEmployeeId()).rejects.toThrow('Не удалось определить ID сотрудника');
            });
        });
    });

    describe('Профиль сотрудника', () => {
        describe('getMyProfile', () => {
            it('должен получать профиль текущего пользователя', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockUserDTO);
                mockUserApiInstance.apiV1UsersMeGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getMyProfile();

                // Assert
                expect(mockUserApiInstance.apiV1UsersMeGet).toHaveBeenCalled();
                expect(result.id).toBe('user-1');
                expect(result.phoneNumber).toBe('+1234567890');
            });

            it('должен обрабатывать ошибки при получении профиля', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockUserApiInstance.apiV1UsersMeGet.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.getMyProfile()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getEmployeeById', () => {
            it('должен получать данные сотрудника по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockEmployeeDTO);
                mockEmployeeApiInstance.apiV1EmployeesIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getEmployeeById('emp-1');

                // Assert
                expect(mockEmployeeApiInstance.apiV1EmployeesIdGet).toHaveBeenCalledWith({
                    id: 'emp-1',
                });
                expect(result.id).toBe('emp-1');
                expect(result.task).toBe('gardener');
            });

            it('должен обрабатывать ошибки при получении сотрудника', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockEmployeeApiInstance.apiV1EmployeesIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.getEmployeeById('invalid-id')).rejects.toThrow('Not found');
            });
        });
    });

    describe('Растения', () => {
        describe('getMyPlants', () => {
            it('должен получать общий список растений', async () => {
                // Arrange
                const plants = [mockPlantDTO, { ...mockPlantDTO, id: 'plant-2' }];
                const mockResponse = mockApiResponse(plants);
                mockPlantApiInstance.apiV1PlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getMyPlants();

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsGet).toHaveBeenCalled();
                expect(result).toHaveLength(2);
                expect(result[0].id).toBe('plant-1');
            });

            it('должен обрабатывать ошибки при получении растений', async () => {
                // Arrange
                mockPlantApiInstance.apiV1PlantsGet.mockRejectedValue(new Error('Network error'));

                // Act & Assert
                await expect(employeeService.getMyPlants()).rejects.toThrow('Network error');
            });
        });

        describe('getEmployeePlants', () => {
            it('должен получать растения конкретного сотрудника', async () => {
                // Arrange
                const plants = [mockPlantDTO];
                const mockResponse = mockApiResponse(plants);
                mockEmployeeApiInstance.apiV1EmployeesPlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getEmployeePlants('emp-1');

                // Assert
                expect(mockEmployeeApiInstance.apiV1EmployeesPlantsGet).toHaveBeenCalledWith({
                    employeeId: 'emp-1',
                });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('plant-1');
            });

            it('должен обрабатывать ошибки при получении растений сотрудника', async () => {
                // Arrange
                const error = createMockError('Employee not found', 404);
                mockEmployeeApiInstance.apiV1EmployeesPlantsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.getEmployeePlants('invalid-id')).rejects.toThrow('Employee not found');
            });
        });

        describe('getPlantById', () => {
            it('должен получать данные растения по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockPlantDTO);
                mockPlantApiInstance.apiV1PlantsIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getPlantById('plant-1');

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsIdGet).toHaveBeenCalledWith({
                    id: 'plant-1',
                });
                expect(result.id).toBe('plant-1');
                expect(result.specie).toBe('Rosa');
            });

            it('должен обрабатывать ошибки при получении растения', async () => {
                // Arrange
                const error = createMockError('Plant not found', 404);
                mockPlantApiInstance.apiV1PlantsIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.getPlantById('invalid-id')).rejects.toThrow('Plant not found');
            });
        });

        describe('updatePlant', () => {
            it('должен обновлять данные растения', async () => {
                // Arrange
                const updatedPlant = { ...mockPlantDTO, name: 'Updated Plant' };
                mockPlantApiInstance.apiV1PlantsIdPut.mockResolvedValue({});

                // Act
                await employeeService.updatePlant('plant-1', updatedPlant);

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsIdPut).toHaveBeenCalledWith({
                    id: 'plant-1',
                    serverControllersModelsPlantDTO: updatedPlant,
                });
            });

            it('должен обрабатывать ошибки при обновлении растения', async () => {
                // Arrange
                const error = createMockError('Validation error', 400);
                mockPlantApiInstance.apiV1PlantsIdPut.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.updatePlant('plant-1', mockPlantDTO)).rejects.toThrow('Validation error');
            });
        });
    });

    describe('Журнал записей', () => {
        describe('getJournalRecords', () => {
            it('должен получать записи журнала без фильтров', async () => {
                // Arrange
                const records = [mockJournalRecordDTO];
                const mockResponse = mockApiResponse(records);
                mockJournalRecordApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getJournalRecords();

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    plantId: undefined,
                    startDate: undefined,
                    endDate: undefined,
                });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('journal-1');
            });

            it('должен получать записи журнала с фильтром по plantId', async () => {
                // Arrange
                const records = [mockJournalRecordDTO];
                const mockResponse = mockApiResponse(records);
                mockJournalRecordApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getJournalRecords('plant-1');

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    plantId: 'plant-1',
                    startDate: undefined,
                    endDate: undefined,
                });
                expect(result).toHaveLength(1);
            });

            it('должен получать записи журнала с фильтром по дате', async () => {
                // Arrange
                const startDate = '2024-12-01';
                const endDate = '2024-12-31';
                const records = [mockJournalRecordDTO];
                const mockResponse = mockApiResponse(records);
                mockJournalRecordApiInstance.apiV1JournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getJournalRecords(undefined, startDate, endDate);

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                    plantId: undefined,
                    startDate,
                    endDate,
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при получении записей журнала', async () => {
                // Arrange
                mockJournalRecordApiInstance.apiV1JournalRecordsGet.mockRejectedValue(new Error('Network error'));

                // Act & Assert
                await expect(employeeService.getJournalRecords()).rejects.toThrow('Network error');
            });
        });

        describe('getJournalRecordById', () => {
            it('должен получать запись журнала по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockJournalRecordDTO);
                mockJournalRecordApiInstance.apiV1JournalRecordsIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getJournalRecordById('journal-1');

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsIdGet).toHaveBeenCalledWith({
                    id: 'journal-1',
                });
                expect(result.id).toBe('journal-1');
                expect(result.plantHeight).toBe(150);
            });

            it('должен обрабатывать ошибки при получении записи журнала', async () => {
                // Arrange
                const error = createMockError('Record not found', 404);
                mockJournalRecordApiInstance.apiV1JournalRecordsIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.getJournalRecordById('invalid-id')).rejects.toThrow('Record not found');
            });
        });

        describe('createJournalRecord', () => {
            it('должен создавать новую запись журнала', async () => {
                // Arrange
                const newRecord = { ...mockJournalRecordDTO, id: '' };
                const createdRecord = { ...newRecord, id: 'new-id' };
                const mockResponse = mockApiResponse(createdRecord);
                mockJournalRecordApiInstance.apiV1JournalRecordsPost.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.createJournalRecord(newRecord);

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsPost).toHaveBeenCalledWith({
                    serverControllersModelsJournalRecordDTO: newRecord,
                });
                expect(result.id).toBe('new-id');
            });

            it('должен обрабатывать ошибки при создании записи журнала', async () => {
                // Arrange
                const error = createMockError('Validation error', 400);
                mockJournalRecordApiInstance.apiV1JournalRecordsPost.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.createJournalRecord(mockJournalRecordDTO)).rejects.toThrow('Validation error');
            });
        });

        describe('updateJournalRecord', () => {
            it('должен обновлять запись журнала', async () => {
                // Arrange
                const updatedRecord = { ...mockJournalRecordDTO, plantHeight: 200 };
                mockJournalRecordApiInstance.apiV1JournalRecordsIdPut.mockResolvedValue({});

                // Act
                await employeeService.updateJournalRecord('journal-1', updatedRecord);

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsIdPut).toHaveBeenCalledWith({
                    id: 'journal-1',
                    serverControllersModelsJournalRecordDTO: updatedRecord,
                });
            });

            it('должен обрабатывать ошибки при обновлении записи журнала', async () => {
                // Arrange
                const error = createMockError('Record not found', 404);
                mockJournalRecordApiInstance.apiV1JournalRecordsIdPut.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.updateJournalRecord('invalid-id', mockJournalRecordDTO)).rejects.toThrow('Record not found');
            });
        });

        describe('deleteJournalRecord', () => {
            it('должен удалять запись журнала', async () => {
                // Arrange
                mockJournalRecordApiInstance.apiV1JournalRecordsIdDelete.mockResolvedValue({});

                // Act
                await employeeService.deleteJournalRecord('journal-1');

                // Assert
                expect(mockJournalRecordApiInstance.apiV1JournalRecordsIdDelete).toHaveBeenCalledWith({
                    id: 'journal-1',
                });
            });

            it('должен обрабатывать ошибки при удалении записи журнала', async () => {
                // Arrange
                const error = createMockError('Record not found', 404);
                mockJournalRecordApiInstance.apiV1JournalRecordsIdDelete.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.deleteJournalRecord('invalid-id')).rejects.toThrow('Record not found');
            });
        });
    });

    describe('Стадии роста', () => {
        describe('getGrowthStages', () => {
            it('должен получать стадии роста без фильтра', async () => {
                // Arrange
                const stages = [mockGrowthStageDTO, { ...mockGrowthStageDTO, id: 'stage-2' }];
                const mockResponse = mockApiResponse(stages);
                mockGrowthStageApiInstance.apiV1GrowthStagesGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getGrowthStages();

                // Assert
                expect(mockGrowthStageApiInstance.apiV1GrowthStagesGet).toHaveBeenCalledWith({
                    name: undefined,
                });
                expect(result).toHaveLength(2);
                expect(result[0].name).toBe('Vegetative');
            });

            it('должен получать стадии роста с фильтром по имени', async () => {
                // Arrange
                const stages = [mockGrowthStageDTO];
                const mockResponse = mockApiResponse(stages);
                mockGrowthStageApiInstance.apiV1GrowthStagesGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getGrowthStages('Vegetative');

                // Assert
                expect(mockGrowthStageApiInstance.apiV1GrowthStagesGet).toHaveBeenCalledWith({
                    name: 'Vegetative',
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при получении стадий роста', async () => {
                // Arrange
                mockGrowthStageApiInstance.apiV1GrowthStagesGet.mockRejectedValue(new Error('Network error'));

                // Act & Assert
                await expect(employeeService.getGrowthStages()).rejects.toThrow('Network error');
            });
        });

        describe('getGrowthStageById', () => {
            it('должен получать стадию роста по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockGrowthStageDTO);
                mockGrowthStageApiInstance.apiV1GrowthStagesIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getGrowthStageById('stage-1');

                // Assert
                expect(mockGrowthStageApiInstance.apiV1GrowthStagesIdGet).toHaveBeenCalledWith({
                    id: 'stage-1',
                });
                expect(result.id).toBe('stage-1');
                expect(result.name).toBe('Vegetative');
            });

            it('должен обрабатывать ошибки при получении стадии роста', async () => {
                // Arrange
                const error = createMockError('Stage not found', 404);
                mockGrowthStageApiInstance.apiV1GrowthStagesIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(employeeService.getGrowthStageById('invalid-id')).rejects.toThrow('Stage not found');
            });
        });
    });

    describe('Поиск растений', () => {
        describe('searchPlants', () => {
            it('должен искать растения без фильтров', async () => {
                // Arrange
                const plants = [mockPlantDTO];
                const mockResponse = mockApiResponse(plants);
                mockPlantApiInstance.apiV1PlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.searchPlants();

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                    family: undefined,
                    species: undefined,
                });
                expect(result).toHaveLength(1);
            });

            it('должен искать растения с фильтром по семейству', async () => {
                // Arrange
                const plants = [mockPlantDTO];
                const mockResponse = mockApiResponse(plants);
                mockPlantApiInstance.apiV1PlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.searchPlants('Rosaceae');

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                    family: 'Rosaceae',
                    species: undefined,
                });
                expect(result).toHaveLength(1);
            });

            it('должен искать растения с фильтром по виду', async () => {
                // Arrange
                const plants = [mockPlantDTO];
                const mockResponse = mockApiResponse(plants);
                mockPlantApiInstance.apiV1PlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.searchPlants(undefined, 'Rosa');

                // Assert
                expect(mockPlantApiInstance.apiV1PlantsGet).toHaveBeenCalledWith({
                    family: undefined,
                    species: 'Rosa',
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при поиске растений', async () => {
                // Arrange
                mockPlantApiInstance.apiV1PlantsGet.mockRejectedValue(new Error('Network error'));

                // Act & Assert
                await expect(employeeService.searchPlants()).rejects.toThrow('Network error');
            });
        });
    });

    describe('Список сотрудников', () => {
        describe('getEmployees', () => {
            it('должен получать список сотрудников без фильтров', async () => {
                // Arrange
                const employees = [mockEmployeeDTO];
                const mockResponse = mockApiResponse(employees);
                mockEmployeeApiInstance.apiV1EmployeesGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getEmployees();

                // Assert
                expect(mockEmployeeApiInstance.apiV1EmployeesGet).toHaveBeenCalledWith({
                    phoneNumber: undefined,
                    task: undefined,
                    plantDomain: undefined,
                });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('emp-1');
            });

            it('должен получать список сотрудников с фильтрами', async () => {
                // Arrange
                const employees = [mockEmployeeDTO];
                const mockResponse = mockApiResponse(employees);
                mockEmployeeApiInstance.apiV1EmployeesGet.mockResolvedValue(mockResponse);

                // Act
                const result = await employeeService.getEmployees('+1234567890', 'gardener', 'greenhouse-1');

                // Assert
                expect(mockEmployeeApiInstance.apiV1EmployeesGet).toHaveBeenCalledWith({
                    phoneNumber: '+1234567890',
                    task: 'gardener',
                    plantDomain: 'greenhouse-1',
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при получении списка сотрудников', async () => {
                // Arrange
                mockEmployeeApiInstance.apiV1EmployeesGet.mockRejectedValue(new Error('Network error'));

                // Act & Assert
                await expect(employeeService.getEmployees()).rejects.toThrow('Network error');
            });
        });
    });

    describe('Обработка ошибок', () => {
        it('должен корректно обрабатывать не-Error объекты', async () => {
            // Arrange
            mockUserApiInstance.apiV1UsersMeGet.mockRejectedValue('Просто строка ошибки');

            // Act & Assert
            await expect(employeeService.getMyProfile()).rejects.toThrow('Ошибка получения профиля сотрудника');
        });

        it('должен корректно обрабатывать Error объекты', async () => {
            // Arrange
            mockUserApiInstance.apiV1UsersMeGet.mockRejectedValue(new Error('Specific error'));

            // Act & Assert
            await expect(employeeService.getMyProfile()).rejects.toThrow('Specific error');
        });
    });
});