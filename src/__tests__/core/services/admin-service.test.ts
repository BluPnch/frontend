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

vi.mock('@/api/generated/api', () => ({
    AdministratorApi: vi.fn(() => ({
        apiV1AdministratorsGet: vi.fn(),
        apiV1AdministratorsIdGet: vi.fn(),
        apiV1AdministratorsPost: vi.fn(),
    })),
    ClientApi: vi.fn(() => ({
        apiV1ClientsGet: vi.fn(),
        apiV1ClientsIdGet: vi.fn(),
        apiV1ClientsClientIdRolePatch: vi.fn(),
        apiV1ClientsJournalRecordsGet: vi.fn(),
        apiV1ClientsPlantsGet: vi.fn(),
    })),
    EmployeeApi: vi.fn(() => ({
        apiV1EmployeesGet: vi.fn(),
        apiV1EmployeesIdGet: vi.fn(),
        apiV1EmployeesPlantsGet: vi.fn(),
    })),
    UserApi: vi.fn(() => ({
        apiV1UsersGet: vi.fn(),
    })),
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

        // Set mock implementations
        (require('@/api/generated/api').AdministratorApi as any).mockImplementation(() => mockAdministratorApi);
        (require('@/api/generated/api').ClientApi as any).mockImplementation(() => mockClientApi);
        (require('@/api/generated/api').EmployeeApi as any).mockImplementation(() => mockEmployeeApi);
        (require('@/api/generated/api').UserApi as any).mockImplementation(() => mockUserApi);
    });

    // Создаем тестовый экземпляр
    const createTestInstance = () => {
        const AdminService = require('@/core/services/admin-service').AdminService;
        const instance = new AdminService();

        // Подменяем API на моки
        (instance as any).administratorApi = mockAdministratorApi;
        (instance as any).clientApi = mockClientApi;
        (instance as any).employeeApi = mockEmployeeApi;
        (instance as any).userApi = mockUserApi;

        return instance;
    };

    describe('getAdministrators', () => {
        const instance = createTestInstance();
        it('should fetch administrators successfully', async () => {
            const instance = createTestInstance();
            const mockAdmins: ServerControllersModelsAdministratorDTO[] = [
                { id: '1', surname: 'Иванов', name: 'Иван', patronymic: 'Иванович' },
                { id: '2', surname: 'Петров', name: 'Петр', patronymic: 'Петрович' }
            ];

            mockAdministratorApi.apiV1AdministratorsGet.mockResolvedValue({
                data: mockAdmins
            });

            const result = await instance.getAdministrators();

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

            const result = await instance.getAdministrators(
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

            await expect(instance.getAdministrators()).rejects.toThrow('Network error');
        });
    });

    describe('getAdministratorById', () => {
        const instance = createTestInstance();
        it('should fetch administrator by id', async () => {
            const mockAdmin: ServerControllersModelsAdministratorDTO = {
                id: '123',
                surname: 'Иванов',
                name: 'Иван'
            };

            mockAdministratorApi.apiV1AdministratorsIdGet.mockResolvedValue({
                data: mockAdmin
            });

            const result = await instance.getAdministratorById('123');

            expect(result).toEqual(mockAdmin);
            expect(mockAdministratorApi.apiV1AdministratorsIdGet).toHaveBeenCalledWith({ id: '123' });
        });
    });

    describe('createAdministrator', () => {
        const instance = createTestInstance();
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

            const result = await instance.createAdministrator(adminData);

            expect(result).toEqual(mockResponse);
            expect(mockAdministratorApi.apiV1AdministratorsPost).toHaveBeenCalledWith({
                serverControllersModelsCreateAdministratorRequestDto: adminData
            });
        });
    });

    describe('getClients', () => {
        const instance = createTestInstance();
        it('should fetch clients successfully', async () => {
            const mockClients: ServerControllersModelsClientDTO[] = [
                { id: '1', companyName: 'Компания 1' },
                { id: '2', companyName: 'Компания 2' }
            ];

            mockClientApi.apiV1ClientsGet.mockResolvedValue({
                data: mockClients
            });

            const result = await instance.getClients();

            expect(result).toEqual(mockClients);
        });

        it('should fetch clients with filters', async () => {
            const mockClients: ServerControllersModelsClientDTO[] = [
                { id: '1', companyName: 'Тестовая компания' }
            ];

            mockClientApi.apiV1ClientsGet.mockResolvedValue({
                data: mockClients
            });

            const result = await instance.getClients('Тестовая компания', '+79991234567');

            expect(result).toEqual(mockClients);
            expect(mockClientApi.apiV1ClientsGet).toHaveBeenCalledWith({
                companyName: 'Тестовая компания',
                phoneNumber: '+79991234567'
            });
        });
    });

    describe('getClientById', () => {
        const instance = createTestInstance();
        it('should fetch client by id', async () => {
            const mockClient: ServerControllersModelsClientDTO = {
                id: '123',
                companyName: 'ООО "Тест"'
            };

            mockClientApi.apiV1ClientsIdGet.mockResolvedValue({
                data: mockClient
            });

            const result = await instance.getClientById('123');

            expect(result).toEqual(mockClient);
        });
    });

    describe('updateUserRole', () => {
        const instance = createTestInstance();
        it('should update user role successfully', async () => {
            const mockResponse = {
                id: '123',
                role: 1 as DomainModelsEnumsEnumAuth
            };

            mockClientApi.apiV1ClientsClientIdRolePatch.mockResolvedValue({
                data: mockResponse
            });

            const result = await instance.updateUserRole('123', 1);

            expect(result).toEqual(mockResponse);
            expect(mockClientApi.apiV1ClientsClientIdRolePatch).toHaveBeenCalledWith({
                clientId: '123',
                serverControllersModelsUpdateUserRoleRequestDto: { newRole: 1 }
            });
        });
    });

    describe('getEmployees', () => {
        const instance = createTestInstance();
        it('should fetch employees successfully', async () => {
            const mockEmployees: ServerControllersModelsEmployeeDTO[] = [
                { id: '1', surname: 'Сидоров', name: 'Сидор' },
                { id: '2', surname: 'Кузнецов', name: 'Алексей' }
            ];

            mockEmployeeApi.apiV1EmployeesGet.mockResolvedValue({
                data: mockEmployees
            });

            const result = await instance.getEmployees();

            expect(result).toEqual(mockEmployees);
        });
    });

    describe('getEmployeePlants', () => {
        const instance = createTestInstance();
        it('should fetch employee plants', async () => {
            const mockPlants = [
                { id: '1', name: 'Растение 1' },
                { id: '2', name: 'Растение 2' }
            ];

            mockEmployeeApi.apiV1EmployeesPlantsGet.mockResolvedValue({
                data: mockPlants
            });

            const result = await instance.getEmployeePlants('emp123');

            expect(result).toEqual(mockPlants);
            expect(mockEmployeeApi.apiV1EmployeesPlantsGet).toHaveBeenCalledWith({
                employeeId: 'emp123'
            });
        });
    });

    describe('getClientJournalRecords', () => {
        const instance = createTestInstance();
        it('should fetch client journal records', async () => {
            const mockRecords = [
                { id: '1', action: 'Полив' },
                { id: '2', action: 'Обрезка' }
            ];

            mockClientApi.apiV1ClientsJournalRecordsGet.mockResolvedValue({
                data: mockRecords
            });

            const result = await instance.getClientJournalRecords();

            expect(result).toEqual(mockRecords);
        });
    });

    describe('getAllUsers', () => {
        const instance = createTestInstance();
        it('should fetch all users', async () => {
            const mockUsers = [
                { id: '1', username: 'admin' },
                { id: '2', username: 'client' }
            ];

            mockUserApi.apiV1UsersGet.mockResolvedValue({
                data: mockUsers
            });

            const result = await instance.getAllUsers();

            expect(result).toEqual(mockUsers);
        });
    });

    describe('deleteUser', () => {
        const instance = createTestInstance();
        it('should throw error as method is not implemented', async () => {
            await expect(instance.deleteUser('123')).rejects.toThrow('Метод удаления пользователя не реализован');
        });
    });

    describe('token management', () => {
        const instance = createTestInstance();
        it('should get token from localStorage', () => {
            localStorage.setItem('token', 'test-token-123');

            // Access private method via any for testing
            const token = (instance as any).getToken();
            expect(token).toBe('test-token-123');
        });

        it('should return null when no token', () => {
            localStorage.removeItem('token');

            const token = (instance as any).getToken();
            expect(token).toBeNull();
        });
    });
});