import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminService } from '@/core/services/admin-service';
import type {
    ServerControllersModelsAdministratorDTO,
    ServerControllersModelsClientDTO,
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsCreateAdministratorRequestDto,
    DomainModelsEnumsEnumAuth
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

describe('AdminService', () => {
    let mockAdministratorApi: any;
    let mockClientApi: any;
    let mockEmployeeApi: any;
    let mockUserApi: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Setup mock implementations
        mockAdministratorApi = {
            apiV1AdministratorsGet: vi.fn(),
            apiV1AdministratorsIdGet: vi.fn(),
            apiV1AdministratorsPost: vi.fn(),
        };

        mockClientApi = {
            apiV1ClientsGet: vi.fn(),
            apiV1ClientsIdGet: vi.fn(),
            apiV1ClientsClientIdRolePatch: vi.fn(),
            apiV1ClientsJournalRecordsGet: vi.fn(),
            apiV1ClientsPlantsGet: vi.fn(),
        };

        mockEmployeeApi = {
            apiV1EmployeesGet: vi.fn(),
            apiV1EmployeesIdGet: vi.fn(),
            apiV1EmployeesPlantsGet: vi.fn(),
        };

        mockUserApi = {
            apiV1UsersGet: vi.fn(),
        };

        // Reinitialize service
        (adminService as any).initializeApis();
    });

    describe('getAdministrators', () => {
        it('should fetch administrators successfully', async () => {
            const mockAdmins: ServerControllersModelsAdministratorDTO[] = [
                { id: '1', surname: 'Иванов', name: 'Иван', patronymic: 'Иванович' },
                { id: '2', surname: 'Петров', name: 'Петр', patronymic: 'Петрович' }
            ];

            mockAdministratorApi.apiV1AdministratorsGet.mockResolvedValue({
                data: mockAdmins
            });

            const result = await adminService.getAdministrators();

            expect(result).toEqual(mockAdmins);
            expect(mockAdministratorApi.apiV1AdministratorsGet).toHaveBeenCalledWith({
                surname: undefined,
                name: undefined,
                patronymic: undefined,
                phoneNumber: undefined
            });
        });

        it('should fetch administrators with filters', async () => {
            const mockAdmins: ServerControllersModelsAdministratorDTO[] = [
                { id: '1', surname: 'Иванов', name: 'Иван', patronymic: 'Иванович' }
            ];

            mockAdministratorApi.apiV1AdministratorsGet.mockResolvedValue({
                data: mockAdmins
            });

            const result = await adminService.getAdministrators(
                'Иванов',
                'Иван',
                'Иванович',
                '+79991234567'
            );

            expect(result).toEqual(mockAdmins);
            expect(mockAdministratorApi.apiV1AdministratorsGet).toHaveBeenCalledWith({
                surname: 'Иванов',
                name: 'Иван',
                patronymic: 'Иванович',
                phoneNumber: '+79991234567'
            });
        });

        it('should throw error when fetching administrators fails', async () => {
            const error = new Error('Network error');
            mockAdministratorApi.apiV1AdministratorsGet.mockRejectedValue(error);

            await expect(adminService.getAdministrators()).rejects.toThrow('Network error');
        });
    });

    describe('getAdministratorById', () => {
        it('should fetch administrator by id', async () => {
            const mockAdmin: ServerControllersModelsAdministratorDTO = {
                id: '123',
                surname: 'Иванов',
                name: 'Иван'
            };

            mockAdministratorApi.apiV1AdministratorsIdGet.mockResolvedValue({
                data: mockAdmin
            });

            const result = await adminService.getAdministratorById('123');

            expect(result).toEqual(mockAdmin);
            expect(mockAdministratorApi.apiV1AdministratorsIdGet).toHaveBeenCalledWith({ id: '123' });
        });
    });

    describe('createAdministrator', () => {
        it('should create administrator successfully', async () => {
            const adminData: ServerControllersModelsCreateAdministratorRequestDto = {
                surname: 'Иванов',
                name: 'Иван',
                password: 'password123'
            };

            const mockResponse: ServerControllersModelsAdministratorDTO = {
                id: '456',
                surname: 'Иванов',
                name: 'Иван'
            };

            mockAdministratorApi.apiV1AdministratorsPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await adminService.createAdministrator(adminData);

            expect(result).toEqual(mockResponse);
            expect(mockAdministratorApi.apiV1AdministratorsPost).toHaveBeenCalledWith({
                serverControllersModelsCreateAdministratorRequestDto: adminData
            });
        });
    });

    describe('getClients', () => {
        it('should fetch clients successfully', async () => {
            const mockClients: ServerControllersModelsClientDTO[] = [
                { id: '1', companyName: 'Компания 1' },
                { id: '2', companyName: 'Компания 2' }
            ];

            mockClientApi.apiV1ClientsGet.mockResolvedValue({
                data: mockClients
            });

            const result = await adminService.getClients();

            expect(result).toEqual(mockClients);
        });

        it('should fetch clients with filters', async () => {
            const mockClients: ServerControllersModelsClientDTO[] = [
                { id: '1', companyName: 'Тестовая компания' }
            ];

            mockClientApi.apiV1ClientsGet.mockResolvedValue({
                data: mockClients
            });

            const result = await adminService.getClients('Тестовая компания', '+79991234567');

            expect(result).toEqual(mockClients);
            expect(mockClientApi.apiV1ClientsGet).toHaveBeenCalledWith({
                companyName: 'Тестовая компания',
                phoneNumber: '+79991234567'
            });
        });
    });

    describe('getClientById', () => {
        it('should fetch client by id', async () => {
            const mockClient: ServerControllersModelsClientDTO = {
                id: '123',
                companyName: 'ООО "Тест"'
            };

            mockClientApi.apiV1ClientsIdGet.mockResolvedValue({
                data: mockClient
            });

            const result = await adminService.getClientById('123');

            expect(result).toEqual(mockClient);
        });
    });

    describe('updateUserRole', () => {
        it('should update user role successfully', async () => {
            const mockResponse = {
                id: '123',
                role: 1 as DomainModelsEnumsEnumAuth
            };

            mockClientApi.apiV1ClientsClientIdRolePatch.mockResolvedValue({
                data: mockResponse
            });

            const result = await adminService.updateUserRole('123', 1);

            expect(result).toEqual(mockResponse);
            expect(mockClientApi.apiV1ClientsClientIdRolePatch).toHaveBeenCalledWith({
                clientId: '123',
                serverControllersModelsUpdateUserRoleRequestDto: { newRole: 1 }
            });
        });
    });

    describe('getEmployees', () => {
        it('should fetch employees successfully', async () => {
            const mockEmployees: ServerControllersModelsEmployeeDTO[] = [
                { id: '1', surname: 'Сидоров', name: 'Сидор' },
                { id: '2', surname: 'Кузнецов', name: 'Алексей' }
            ];

            mockEmployeeApi.apiV1EmployeesGet.mockResolvedValue({
                data: mockEmployees
            });

            const result = await adminService.getEmployees();

            expect(result).toEqual(mockEmployees);
        });
    });

    describe('getEmployeePlants', () => {
        it('should fetch employee plants', async () => {
            const mockPlants = [
                { id: '1', name: 'Растение 1' },
                { id: '2', name: 'Растение 2' }
            ];

            mockEmployeeApi.apiV1EmployeesPlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await adminService.getEmployeePlants('emp123');

            expect(result).toEqual(mockPlants);
            expect(mockEmployeeApi.apiV1EmployeesPlantsGet).toHaveBeenCalledWith({
                employeeId: 'emp123'
            });
        });
    });

    describe('getClientJournalRecords', () => {
        it('should fetch client journal records', async () => {
            const mockRecords = [
                { id: '1', action: 'Полив' },
                { id: '2', action: 'Обрезка' }
            ];

            mockClientApi.apiV1ClientsJournalRecordsGet.mockResolvedValue({
                data: mockRecords
            });

            const result = await adminService.getClientJournalRecords();

            expect(result).toEqual(mockRecords);
        });
    });

    describe('getAllUsers', () => {
        it('should fetch all users', async () => {
            const mockUsers = [
                { id: '1', username: 'admin' },
                { id: '2', username: 'client' }
            ];

            mockUserApi.apiV1UsersGet.mockResolvedValue({
                data: mockUsers
            });

            const result = await adminService.getAllUsers();

            expect(result).toEqual(mockUsers);
        });
    });

    describe('deleteUser', () => {
        it('should throw error as method is not implemented', async () => {
            await expect(adminService.deleteUser('123')).rejects.toThrow('Метод удаления пользователя не реализован');
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            localStorage.setItem('token', 'test-token-123');

            // Access private method via any for testing
            const token = (adminService as any).getToken();
            expect(token).toBe('test-token-123');
        });

        it('should return null when no token', () => {
            localStorage.removeItem('token');

            const token = (adminService as any).getToken();
            expect(token).toBeNull();
        });
    });
});