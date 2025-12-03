import { adminService } from '../../core/services/admin-service';
import type {
    ServerControllersModelsClientDTO,
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsAdministratorDTO,
    ServerControllersModelsCreateAdministratorRequestDto,
    ServerControllersModelsAuthUserDTO,
    DomainModelsEnumsEnumAuth,
    ServerControllersModelsUpdateUserRoleRequestDto
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
    AdministratorApi: jest.fn().mockImplementation(() => ({
        apiV1AdministratorsGet: jest.fn(),
        apiV1AdministratorsIdGet: jest.fn(),
        apiV1AdministratorsPost: jest.fn(),
    })),
    ClientApi: jest.fn().mockImplementation(() => ({
        apiV1ClientsGet: jest.fn(),
        apiV1ClientsIdGet: jest.fn(),
        apiV1ClientsClientIdRolePatch: jest.fn(),
        apiV1ClientsJournalRecordsGet: jest.fn(),
        apiV1ClientsPlantsGet: jest.fn(),
    })),
    EmployeeApi: jest.fn().mockImplementation(() => ({
        apiV1EmployeesGet: jest.fn(),
        apiV1EmployeesIdGet: jest.fn(),
        apiV1EmployeesPlantsGet: jest.fn(),
    })),
    UserApi: jest.fn().mockImplementation(() => ({
        apiV1UsersGet: jest.fn(),
    })),
    DomainModelsEnumsEnumAuth: {
        Admin: 0,
        User: 1,
        Guest: 2,
    },
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

describe('AdminService', () => {
    let mockAdministratorApiInstance: any;
    let mockClientApiInstance: any;
    let mockEmployeeApiInstance: any;
    let mockUserApiInstance: any;

    const mockAdministratorDTO: ServerControllersModelsAdministratorDTO = {
        id: 'admin-1',
        surname: 'Иванов',
        name: 'Иван',
        patronymic: 'Иванович',
        phoneNumber: '+1234567890',
    };

    const mockCreateAdministratorRequest: ServerControllersModelsCreateAdministratorRequestDto = {
        surname: 'Иванов',
        name: 'Иван',
        patronymic: 'Иванович',
        phoneNumber: '+1234567890',
        password: 'password123',
    };

    const mockClientDTO: ServerControllersModelsClientDTO = {
        id: 'client-1',
        companyName: 'Test Company',
        phoneNumber: '+0987654321',
    };

    const mockEmployeeDTO: ServerControllersModelsEmployeeDTO = {
        id: 'emp-1',
        surname: 'Петров',
        name: 'Петр',
        patronymic: 'Петрович',
        phoneNumber: '+1122334455',
        task: 'gardener',
        plantDomain: 'greenhouse-1',
        administratorId: 'admin-1',
    };

    const mockAuthUserDTO: ServerControllersModelsAuthUserDTO = {
        id: 'user-1',
        username: 'admin_user',
        role: 0,
    };

    const mockPlantData = {
        id: 'plant-1',
        name: 'Test Plant',
    };

    const mockJournalRecordData = {
        id: 'journal-1',
        date: '2024-12-01',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('test-token');

        // Получаем мок экземпляры API
        mockAdministratorApiInstance = (adminService as any).administratorApi;
        mockClientApiInstance = (adminService as any).clientApi;
        mockEmployeeApiInstance = (adminService as any).employeeApi;
        mockUserApiInstance = (adminService as any).userApi;
    });

    describe('Инициализация', () => {
        it('должен инициализировать все API клиенты', () => {
            expect(mockAdministratorApiInstance).toBeDefined();
            expect(mockClientApiInstance).toBeDefined();
            expect(mockEmployeeApiInstance).toBeDefined();
            expect(mockUserApiInstance).toBeDefined();
        });

        it('должен предоставлять все публичные методы', () => {
            expect(typeof adminService.getAdministrators).toBe('function');
            expect(typeof adminService.getAdministratorById).toBe('function');
            expect(typeof adminService.createAdministrator).toBe('function');

            expect(typeof adminService.getClients).toBe('function');
            expect(typeof adminService.getClientById).toBe('function');
            expect(typeof adminService.updateUserRole).toBe('function');

            expect(typeof adminService.getEmployees).toBe('function');
            expect(typeof adminService.getEmployeeById).toBe('function');

            expect(typeof adminService.getEmployeePlants).toBe('function');
            expect(typeof adminService.getClientJournalRecords).toBe('function');
            expect(typeof adminService.getClientPlants).toBe('function');

            expect(typeof adminService.getAllUsers).toBe('function');
            expect(typeof adminService.deleteUser).toBe('function');
        });
    });

    describe('Администраторы', () => {
        describe('getAdministrators', () => {
            it('должен получать список администраторов без фильтров', async () => {
                // Arrange
                const administrators = [mockAdministratorDTO];
                const mockResponse = mockApiResponse(administrators);
                mockAdministratorApiInstance.apiV1AdministratorsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getAdministrators();

                // Assert
                expect(mockAdministratorApiInstance.apiV1AdministratorsGet).toHaveBeenCalledWith({
                    surname: undefined,
                    name: undefined,
                    patronymic: undefined,
                    phoneNumber: undefined,
                });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('admin-1');
                expect(result[0].surname).toBe('Иванов');
            });

            it('должен получать список администраторов с фильтрами', async () => {
                // Arrange
                const administrators = [mockAdministratorDTO];
                const mockResponse = mockApiResponse(administrators);
                mockAdministratorApiInstance.apiV1AdministratorsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getAdministrators('Иванов', 'Иван', 'Иванович', '+1234567890');

                // Assert
                expect(mockAdministratorApiInstance.apiV1AdministratorsGet).toHaveBeenCalledWith({
                    surname: 'Иванов',
                    name: 'Иван',
                    patronymic: 'Иванович',
                    phoneNumber: '+1234567890',
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при получении администраторов', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockAdministratorApiInstance.apiV1AdministratorsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getAdministrators()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getAdministratorById', () => {
            it('должен получать администратора по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockAdministratorDTO);
                mockAdministratorApiInstance.apiV1AdministratorsIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getAdministratorById('admin-1');

                // Assert
                expect(mockAdministratorApiInstance.apiV1AdministratorsIdGet).toHaveBeenCalledWith({
                    id: 'admin-1',
                });
                expect(result.id).toBe('admin-1');
                expect(result.surname).toBe('Иванов');
            });

            it('должен обрабатывать ошибки при получении администратора', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockAdministratorApiInstance.apiV1AdministratorsIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getAdministratorById('invalid-id')).rejects.toThrow('Not found');
            });
        });

        describe('createAdministrator', () => {
            it('должен создавать нового администратора', async () => {
                // Arrange
                const createdAdministrator = { ...mockAdministratorDTO, id: 'new-admin-id' };
                const mockResponse = mockApiResponse(createdAdministrator);
                mockAdministratorApiInstance.apiV1AdministratorsPost.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.createAdministrator(mockCreateAdministratorRequest);

                // Assert
                expect(mockAdministratorApiInstance.apiV1AdministratorsPost).toHaveBeenCalledWith({
                    serverControllersModelsCreateAdministratorRequestDto: mockCreateAdministratorRequest,
                });
                expect(result.id).toBe('new-admin-id');
            });

            it('должен обрабатывать ошибки при создании администратора', async () => {
                // Arrange
                const error = createMockError('Validation error', 400);
                mockAdministratorApiInstance.apiV1AdministratorsPost.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.createAdministrator(mockCreateAdministratorRequest)).rejects.toThrow('Validation error');
            });
        });
    });

    describe('Клиенты', () => {
        describe('getClients', () => {
            it('должен получать список клиентов без фильтров', async () => {
                // Arrange
                const clients = [mockClientDTO];
                const mockResponse = mockApiResponse(clients);
                mockClientApiInstance.apiV1ClientsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getClients();

                // Assert
                expect(mockClientApiInstance.apiV1ClientsGet).toHaveBeenCalledWith({
                    companyName: undefined,
                    phoneNumber: undefined,
                });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('client-1');
                expect(result[0].companyName).toBe('Test Company');
            });

            it('должен получать список клиентов с фильтрами', async () => {
                // Arrange
                const clients = [mockClientDTO];
                const mockResponse = mockApiResponse(clients);
                mockClientApiInstance.apiV1ClientsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getClients('Test Company', '+0987654321');

                // Assert
                expect(mockClientApiInstance.apiV1ClientsGet).toHaveBeenCalledWith({
                    companyName: 'Test Company',
                    phoneNumber: '+0987654321',
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при получении клиентов', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockClientApiInstance.apiV1ClientsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getClients()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getClientById', () => {
            it('должен получать клиента по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockClientDTO);
                mockClientApiInstance.apiV1ClientsIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getClientById('client-1');

                // Assert
                expect(mockClientApiInstance.apiV1ClientsIdGet).toHaveBeenCalledWith({
                    id: 'client-1',
                });
                expect(result.id).toBe('client-1');
                expect(result.companyName).toBe('Test Company');
            });

            it('должен обрабатывать ошибки при получении клиента', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockClientApiInstance.apiV1ClientsIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getClientById('invalid-id')).rejects.toThrow('Not found');
            });
        });

        describe('updateUserRole', () => {
            it('должен обновлять роль пользователя', async () => {
                // Arrange
                const updatedUser = { ...mockAuthUserDTO, role: 1 as DomainModelsEnumsEnumAuth }; // User
                const mockResponse = mockApiResponse(updatedUser);
                mockClientApiInstance.apiV1ClientsClientIdRolePatch.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.updateUserRole('client-1', 1 as DomainModelsEnumsEnumAuth);

                // Assert
                expect(mockClientApiInstance.apiV1ClientsClientIdRolePatch).toHaveBeenCalledWith({
                    clientId: 'client-1',
                    serverControllersModelsUpdateUserRoleRequestDto: {
                        newRole: 1,
                    },
                });
                expect(result.role).toBe(1);
            });

            it('должен обрабатывать ошибки при обновлении роли пользователя', async () => {
                // Arrange
                const error = createMockError('Forbidden', 403);
                mockClientApiInstance.apiV1ClientsClientIdRolePatch.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.updateUserRole('client-1', 1 as DomainModelsEnumsEnumAuth)).rejects.toThrow('Forbidden');
            });
        });
    });

    describe('Сотрудники', () => {
        describe('getEmployees', () => {
            it('должен получать список сотрудников без фильтров', async () => {
                // Arrange
                const employees = [mockEmployeeDTO];
                const mockResponse = mockApiResponse(employees);
                mockEmployeeApiInstance.apiV1EmployeesGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getEmployees();

                // Assert
                expect(mockEmployeeApiInstance.apiV1EmployeesGet).toHaveBeenCalledWith({
                    phoneNumber: undefined,
                    task: undefined,
                    plantDomain: undefined,
                });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('emp-1');
                expect(result[0].task).toBe('gardener');
            });

            it('должен получать список сотрудников с фильтрами', async () => {
                // Arrange
                const employees = [mockEmployeeDTO];
                const mockResponse = mockApiResponse(employees);
                mockEmployeeApiInstance.apiV1EmployeesGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getEmployees('+1122334455', 'gardener', 'greenhouse-1');

                // Assert
                expect(mockEmployeeApiInstance.apiV1EmployeesGet).toHaveBeenCalledWith({
                    phoneNumber: '+1122334455',
                    task: 'gardener',
                    plantDomain: 'greenhouse-1',
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при получении сотрудников', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockEmployeeApiInstance.apiV1EmployeesGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getEmployees()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getEmployeeById', () => {
            it('должен получать сотрудника по ID', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockEmployeeDTO);
                mockEmployeeApiInstance.apiV1EmployeesIdGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getEmployeeById('emp-1');

                // Assert
                expect(mockEmployeeApiInstance.apiV1EmployeesIdGet).toHaveBeenCalledWith({
                    id: 'emp-1',
                });
                expect(result.id).toBe('emp-1');
                expect(result.name).toBe('Петр');
            });

            it('должен обрабатывать ошибки при получении сотрудника', async () => {
                // Arrange
                const error = createMockError('Not found', 404);
                mockEmployeeApiInstance.apiV1EmployeesIdGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getEmployeeById('invalid-id')).rejects.toThrow('Not found');
            });
        });

        describe('getEmployeePlants', () => {
            it('должен получать растения сотрудника с указанием ID', async () => {
                // Arrange
                const plants = [mockPlantData];
                const mockResponse = mockApiResponse(plants);
                mockEmployeeApiInstance.apiV1EmployeesPlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getEmployeePlants('emp-1');

                // Assert
                expect(mockEmployeeApiInstance.apiV1EmployeesPlantsGet).toHaveBeenCalledWith({
                    employeeId: 'emp-1',
                });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('plant-1');
            });

            it('должен получать растения всех сотрудников без указания ID', async () => {
                // Arrange
                const plants = [mockPlantData];
                const mockResponse = mockApiResponse(plants);
                mockEmployeeApiInstance.apiV1EmployeesPlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getEmployeePlants();

                // Assert
                expect(mockEmployeeApiInstance.apiV1EmployeesPlantsGet).toHaveBeenCalledWith({
                    employeeId: undefined,
                });
                expect(result).toHaveLength(1);
            });

            it('должен обрабатывать ошибки при получении растений сотрудника', async () => {
                // Arrange
                const error = createMockError('Employee not found', 404);
                mockEmployeeApiInstance.apiV1EmployeesPlantsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getEmployeePlants('invalid-id')).rejects.toThrow('Employee not found');
            });
        });
    });

    describe('Клиентские данные', () => {
        describe('getClientJournalRecords', () => {
            it('должен получать записи журнала клиента', async () => {
                // Arrange
                const journalRecords = [mockJournalRecordData];
                const mockResponse = mockApiResponse(journalRecords);
                mockClientApiInstance.apiV1ClientsJournalRecordsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getClientJournalRecords();

                // Assert
                expect(mockClientApiInstance.apiV1ClientsJournalRecordsGet).toHaveBeenCalled();
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('journal-1');
            });

            it('должен обрабатывать ошибки при получении записей журнала клиента', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockClientApiInstance.apiV1ClientsJournalRecordsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getClientJournalRecords()).rejects.toThrow('Unauthorized');
            });
        });

        describe('getClientPlants', () => {
            it('должен получать растения клиента', async () => {
                // Arrange
                const plants = [mockPlantData];
                const mockResponse = mockApiResponse(plants);
                mockClientApiInstance.apiV1ClientsPlantsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getClientPlants();

                // Assert
                expect(mockClientApiInstance.apiV1ClientsPlantsGet).toHaveBeenCalled();
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('plant-1');
            });

            it('должен обрабатывать ошибки при получении растений клиента', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockClientApiInstance.apiV1ClientsPlantsGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getClientPlants()).rejects.toThrow('Unauthorized');
            });
        });
    });

    describe('Пользователи', () => {
        describe('getAllUsers', () => {
            it('должен получать список всех пользователей', async () => {
                // Arrange
                const users = [mockAuthUserDTO];
                const mockResponse = mockApiResponse(users);
                mockUserApiInstance.apiV1UsersGet.mockResolvedValue(mockResponse);

                // Act
                const result = await adminService.getAllUsers();

                // Assert
                expect(mockUserApiInstance.apiV1UsersGet).toHaveBeenCalled();
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('user-1');
                expect(result[0].role).toBe(0);
            });

            it('должен обрабатывать ошибки при получении списка пользователей', async () => {
                // Arrange
                const error = createMockError('Unauthorized', 401);
                mockUserApiInstance.apiV1UsersGet.mockRejectedValue(error);

                // Act & Assert
                await expect(adminService.getAllUsers()).rejects.toThrow('Unauthorized');
            });
        });

        describe('deleteUser', () => {
            it('должен выбрасывать ошибку так как метод не реализован', async () => {
                // Act & Assert
                await expect(adminService.deleteUser('user-1')).rejects.toThrow('Метод удаления пользователя не реализован');
            });
        });
    });

    describe('Обработка ошибок', () => {
        it('должен корректно обрабатывать не-Error объекты', async () => {
            // Arrange
            mockAdministratorApiInstance.apiV1AdministratorsGet.mockRejectedValue('Просто строка ошибки');

            // Act & Assert
            await expect(adminService.getAdministrators()).rejects.toThrow('Ошибка получения списка администраторов');
        });

        it('должен корректно обрабатывать Error объекты', async () => {
            // Arrange
            mockAdministratorApiInstance.apiV1AdministratorsGet.mockRejectedValue(new Error('Specific error'));

            // Act & Assert
            await expect(adminService.getAdministrators()).rejects.toThrow('Specific error');
        });
    });
});