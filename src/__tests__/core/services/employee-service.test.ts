import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { employeeService } from '@/core/services/employee-service';
import type {
    ServerControllersModelsUserDTO,
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsPlantDTO,
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsGrowthStageDTO
} from '@/api/generated/api';

// Mock modules
vi.mock('@/api/generated/api', () => import('../../__mocks__/api'));

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

describe('EmployeeService', () => {
    let mockEmployeeApi: any;
    let mockPlantApi: any;
    let mockJournalRecordApi: any;
    let mockGrowthStageApi: any;
    let mockUserApi: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Setup mock implementations
        mockEmployeeApi = {
            apiV1EmployeesIdGet: vi.fn(),
            apiV1EmployeesPlantsGet: vi.fn(),
            apiV1EmployeesGet: vi.fn(),
        };

        mockPlantApi = {
            apiV1PlantsGet: vi.fn(),
            apiV1PlantsIdGet: vi.fn(),
            apiV1PlantsIdPut: vi.fn(),
        };

        mockJournalRecordApi = {
            apiV1JournalRecordsGet: vi.fn(),
            apiV1JournalRecordsIdGet: vi.fn(),
            apiV1JournalRecordsPost: vi.fn(),
            apiV1JournalRecordsIdPut: vi.fn(),
            apiV1JournalRecordsIdDelete: vi.fn(),
        };

        mockGrowthStageApi = {
            apiV1GrowthStagesGet: vi.fn(),
            apiV1GrowthStagesIdGet: vi.fn(),
        };

        mockUserApi = {
            apiV1UsersMeGet: vi.fn(),
        };

        // Reset service state
        (employeeService as any).currentEmployeeId = null;
        (employeeService as any).initializeApis();
    });

    describe('getCurrentEmployeeId', () => {
        it('should return cached employee ID if available', async () => {
            (employeeService as any).currentEmployeeId = 'cached-123';

            const result = await employeeService.getCurrentEmployeeId();

            expect(result).toBe('cached-123');
            expect(mockUserApi.apiV1UsersMeGet).not.toHaveBeenCalled();
        });

        it('should fetch employee ID from profile and cache it', async () => {
            // Используйте только те поля, которые определены в интерфейсе
            const mockProfile: ServerControllersModelsUserDTO = {
                id: 'employee-456',
                phoneNumber: '+79991234567'
                // username не существует в типе
            };

            mockUserApi.apiV1UsersMeGet.mockResolvedValue({
                data: mockProfile
            });

            const result = await employeeService.getCurrentEmployeeId();

            expect(result).toBe('employee-456');
            expect(mockUserApi.apiV1UsersMeGet).toHaveBeenCalled();
            expect((employeeService as any).currentEmployeeId).toBe('employee-456');
        });

        it('should throw error when profile has no ID', async () => {
            // Если нет id, используйте пустой объект или только phoneNumber
            const mockProfile: ServerControllersModelsUserDTO = {
                phoneNumber: '+79991234567'
                // No id
            };

            mockUserApi.apiV1UsersMeGet.mockResolvedValue({
                data: mockProfile
            });

            await expect(employeeService.getCurrentEmployeeId()).rejects.toThrow('Не удалось определить ID сотрудника');
        });

        it('should throw error when profile fetch fails', async () => {
            mockUserApi.apiV1UsersMeGet.mockRejectedValue(new Error('Network error'));

            await expect(employeeService.getCurrentEmployeeId()).rejects.toThrow('Network error');
        });
    });

    describe('getMyProfile', () => {
        it('should fetch current employee profile', async () => {
            const mockProfile: ServerControllersModelsUserDTO = {
                id: 'emp1',
                phoneNumber: '+79991234567'
                // role не существует в типе ServerControllersModelsUserDTO
            };

            mockUserApi.apiV1UsersMeGet.mockResolvedValue({
                data: mockProfile
            });

            const result = await employeeService.getMyProfile();

            expect(result).toEqual(mockProfile);
            expect(mockUserApi.apiV1UsersMeGet).toHaveBeenCalled();
        });
    });

    describe('getEmployeeById', () => {
        it('should fetch employee by ID', async () => {
            const mockEmployee: ServerControllersModelsEmployeeDTO = {
                id: 'emp123',
                surname: 'Иванов',
                name: 'Иван',
                patronymic: 'Иванович'
            };

            mockEmployeeApi.apiV1EmployeesIdGet.mockResolvedValue({
                data: mockEmployee
            });

            const result = await employeeService.getEmployeeById('emp123');

            expect(result).toEqual(mockEmployee);
            expect(mockEmployeeApi.apiV1EmployeesIdGet).toHaveBeenCalledWith({ id: 'emp123' });
        });
    });

    describe('getMyPlants', () => {
        it('should fetch all plants', async () => {
            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' },
                { id: 'plant2', family: 'Liliaceae', specie: 'Lilium' }
            ];

            mockPlantApi.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await employeeService.getMyPlants();

            expect(result).toEqual(mockPlants);
            expect(mockPlantApi.apiV1PlantsGet).toHaveBeenCalledWith(undefined);
        });

        it('should log plant retrieval', async () => {
            const consoleSpy = vi.spyOn(console, 'log');
            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Test' }
            ];

            mockPlantApi.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            await employeeService.getMyPlants();

            expect(consoleSpy).toHaveBeenCalledWith('🟡 EmployeeService: Using GENERAL plants list (all plants)');
            expect(consoleSpy).toHaveBeenCalledWith('✅ EmployeeService: General plants received:', 1);
        });
    });

    describe('getEmployeePlants', () => {
        it('should fetch plants for specific employee', async () => {
            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Test' }
            ];

            mockEmployeeApi.apiV1EmployeesPlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await employeeService.getEmployeePlants('emp123');

            expect(result).toEqual(mockPlants);
            expect(mockEmployeeApi.apiV1EmployeesPlantsGet).toHaveBeenCalledWith({
                employeeId: 'emp123'
            });
        });
    });

    describe('getPlantById', () => {
        it('should fetch plant by ID', async () => {
            const mockPlant: ServerControllersModelsPlantDTO = {
                id: 'plant123',
                family: 'Rosaceae',
                specie: 'Rosa'
            };

            mockPlantApi.apiV1PlantsIdGet.mockResolvedValue({
                data: mockPlant
            });

            const result = await employeeService.getPlantById('plant123');

            expect(result).toEqual(mockPlant);
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

            await employeeService.updatePlant('plant123', plantData);

            expect(mockPlantApi.apiV1PlantsIdPut).toHaveBeenCalledWith({
                id: 'plant123',
                serverControllersModelsPlantDTO: plantData
            });
        });
    });

    describe('Journal Records', () => {
        it('should get journal records with filters', async () => {
            const mockRecords: ServerControllersModelsJournalRecordDTO[] = [
                { id: 'record1', plantId: 'plant1' },
                { id: 'record2', plantId: 'plant2' }
            ];

            mockJournalRecordApi.apiV1JournalRecordsGet.mockResolvedValue({
                data: mockRecords
            });

            const result = await employeeService.getJournalRecords('plant1', '2024-01-01', '2024-12-31');

            expect(result).toEqual(mockRecords);
            expect(mockJournalRecordApi.apiV1JournalRecordsGet).toHaveBeenCalledWith({
                plantId: 'plant1',
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            });
        });

        it('should create journal record', async () => {
            const recordData: ServerControllersModelsJournalRecordDTO = {
                plantId: 'plant1',
                growthStageId: 'stage1',
                employeeId: 'emp1'
            };

            const mockResponse: ServerControllersModelsJournalRecordDTO = {
                id: 'new-record',
                ...recordData
            };

            mockJournalRecordApi.apiV1JournalRecordsPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await employeeService.createJournalRecord(recordData);

            expect(result).toEqual(mockResponse);
            expect(mockJournalRecordApi.apiV1JournalRecordsPost).toHaveBeenCalledWith({
                serverControllersModelsJournalRecordDTO: recordData
            });
        });

        it('should update journal record', async () => {
            const recordData: ServerControllersModelsJournalRecordDTO = {
                id: 'record1',
                plantId: 'plant1'
            };

            mockJournalRecordApi.apiV1JournalRecordsIdPut.mockResolvedValue({});

            await employeeService.updateJournalRecord('record1', recordData);

            expect(mockJournalRecordApi.apiV1JournalRecordsIdPut).toHaveBeenCalledWith({
                id: 'record1',
                serverControllersModelsJournalRecordDTO: recordData
            });
        });

        it('should delete journal record', async () => {
            mockJournalRecordApi.apiV1JournalRecordsIdDelete.mockResolvedValue({});

            await employeeService.deleteJournalRecord('record1');

            expect(mockJournalRecordApi.apiV1JournalRecordsIdDelete).toHaveBeenCalledWith({
                id: 'record1'
            });
        });
    });

    describe('Growth Stages', () => {
        it('should get growth stages', async () => {
            const mockStages: ServerControllersModelsGrowthStageDTO[] = [
                { id: 'stage1', name: 'Прорастание' },
                { id: 'stage2', name: 'Цветение' }
            ];

            mockGrowthStageApi.apiV1GrowthStagesGet.mockResolvedValue({
                data: mockStages
            });

            const result = await employeeService.getGrowthStages('Прорастание');

            expect(result).toEqual(mockStages);
            expect(mockGrowthStageApi.apiV1GrowthStagesGet).toHaveBeenCalledWith({
                name: 'Прорастание'
            });
        });

        it('should get growth stage by ID', async () => {
            const mockStage: ServerControllersModelsGrowthStageDTO = {
                id: 'stage1',
                name: 'Прорастание',
                description: 'Начальная стадия'
            };

            mockGrowthStageApi.apiV1GrowthStagesIdGet.mockResolvedValue({
                data: mockStage
            });

            const result = await employeeService.getGrowthStageById('stage1');

            expect(result).toEqual(mockStage);
        });
    });

    describe('searchPlants', () => {
        it('should search plants with filters', async () => {
            const mockPlants: ServerControllersModelsPlantDTO[] = [
                { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' }
            ];

            mockPlantApi.apiV1PlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await employeeService.searchPlants('Rosaceae', 'Rosa');

            expect(result).toEqual(mockPlants);
            expect(mockPlantApi.apiV1PlantsGet).toHaveBeenCalledWith({
                family: 'Rosaceae',
                species: 'Rosa'
            });
        });
    });

    describe('getEmployees', () => {
        it('should fetch employees with filters', async () => {
            const mockEmployees: ServerControllersModelsEmployeeDTO[] = [
                { id: 'emp1', surname: 'Иванов', name: 'Иван' },
                { id: 'emp2', surname: 'Петров', name: 'Петр' }
            ];

            mockEmployeeApi.apiV1EmployeesGet.mockResolvedValue({
                data: mockEmployees
            });

            const result = await employeeService.getEmployees('+79991234567', 'Уход', 'Садоводство');

            expect(result).toEqual(mockEmployees);
            expect(mockEmployeeApi.apiV1EmployeesGet).toHaveBeenCalledWith({
                phoneNumber: '+79991234567',
                task: 'Уход',
                plantDomain: 'Садоводство'
            });
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            localStorage.setItem('token', 'employee-token');

            const token = (employeeService as any).getToken();
            expect(token).toBe('employee-token');
        });

        it('should return null when no token', () => {
            localStorage.removeItem('token');

            const token = (employeeService as any).getToken();
            expect(token).toBeNull();
        });
    });

    describe('console logging', () => {
        let consoleSpy: any;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log');
        });

        afterEach(() => {
            if (consoleSpy) {
                consoleSpy.mockRestore();
            }
        });

        it('should log request details', async () => {
            const mockPlant: ServerControllersModelsPlantDTO = {
                id: 'plant1',
                family: 'Test'
            };

            mockPlantApi.apiV1PlantsIdGet.mockResolvedValue({
                data: mockPlant
            });

            await employeeService.getPlantById('plant1');

            expect(consoleSpy).toHaveBeenCalledWith('🚀 EmployeeService Request:', expect.any(String));
            expect(consoleSpy).toHaveBeenCalledWith('✅ Added Authorization header to employee request');
        });
    });
});