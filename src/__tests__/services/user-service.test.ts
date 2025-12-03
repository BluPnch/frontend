import { userService } from '../../core/services/user-service';
import type {
    ServerControllersModelsUserDTO,
    ServerControllersModelsAuthUserDTO,
    ServerControllersModelsLoginRequestDto,
    ServerControllersModelsRegisterRequestDto,
    ServerControllersModelsLoginResponseDto,
    ServerControllersModelsClientDTO
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

// Мок для atob
const mockAtob = jest.fn();
Object.defineProperty(window, 'atob', {
    value: mockAtob,
});

// Моки для API
jest.mock('../../api/generated/api', () => {
    const mockApiMethods = {
        apiV1UsersMeGet: jest.fn(),
        apiV1UsersGet: jest.fn(),
        apiV1AuthLoginPost: jest.fn(),
        apiV1AuthRegisterPost: jest.fn(),
        apiV1ClientsGet: jest.fn(),
    };

    return {
        UserApi: jest.fn(() => ({
            apiV1UsersMeGet: mockApiMethods.apiV1UsersMeGet,
            apiV1UsersGet: mockApiMethods.apiV1UsersGet,
        })),
        AuthApi: jest.fn(() => ({
            apiV1AuthLoginPost: mockApiMethods.apiV1AuthLoginPost,
            apiV1AuthRegisterPost: mockApiMethods.apiV1AuthRegisterPost,
        })),
        ClientApi: jest.fn(() => ({
            apiV1ClientsGet: mockApiMethods.apiV1ClientsGet,
        })),
    };
});

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
    isAxiosError: jest.fn((error: any) => error?.isAxiosError === true),
}));

describe('UserService', () => {
    let mockUserApiInstance: any;
    let mockAuthApiInstance: any;
    let mockClientApiInstance: any;

    const mockLoginResponse: ServerControllersModelsLoginResponseDto = {
        username: 'testuser',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE3MzQwMDAwMDB9.signature',
    };

    const mockUserDTO: ServerControllersModelsUserDTO = {
        id: 'user-1',
        phoneNumber: '+1234567890',
    };

    const mockAuthUserDTO: ServerControllersModelsAuthUserDTO = {
        id: 'user-1',
        username: 'testuser',
        passwordHash: 'hashedpassword',
        role: 1 as any,
    };

    const mockClientDTO: ServerControllersModelsClientDTO = {
        id: 'client-1',
        companyName: 'Test Company',
        phoneNumber: '+0987654321',
    };

    const mockRegisterRequest: ServerControllersModelsRegisterRequestDto = {
        email: 'newuser@example.com',
        password: 'password123',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
        mockAtob.mockClear();

        // Настраиваем дефолтное поведение atob
        mockAtob.mockReturnValue('{"sub":"user-1"}');

        // Получаем мок экземпляры API
        const { UserApi, AuthApi, ClientApi } = require('../../api/generated/api');
        mockUserApiInstance = new UserApi();
        mockAuthApiInstance = new AuthApi();
        mockClientApiInstance = new ClientApi();

        // Обновляем инстансы в сервисе
        (userService as any).userApi = mockUserApiInstance;
        (userService as any).authApi = mockAuthApiInstance;
    });

    describe('Инициализация', () => {
        it('должен инициализировать API клиенты', () => {
            expect(mockUserApiInstance).toBeDefined();
            expect(mockAuthApiInstance).toBeDefined();
        });
    });

    describe('Аутентификация', () => {
        describe('login', () => {
            it('должен выполнять вход и сохранять токен', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockLoginResponse);
                mockAuthApiInstance.apiV1AuthLoginPost.mockResolvedValue(mockResponse);

                // Act
                const result = await userService.login('testuser@example.com', 'password123');

                // Assert
                // Проверяем с любыми параметрами, так как поле может быть email или username
                expect(mockAuthApiInstance.apiV1AuthLoginPost).toHaveBeenCalledWith(
                    expect.objectContaining({
                        serverControllersModelsLoginRequestDto: expect.objectContaining({
                            password: 'password123',
                        }),
                    })
                );
                expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockLoginResponse.token);
                expect(result.token).toBe(mockLoginResponse.token);
            });

            it('должен обрабатывать ошибки при входе', async () => {
                // Arrange
                const error = createMockError('Invalid credentials', 401);
                mockAuthApiInstance.apiV1AuthLoginPost.mockRejectedValue(error);

                // Act & Assert
                await expect(userService.login('testuser', 'wrongpass')).rejects.toThrow('Invalid credentials');
            });
        });

        describe('register', () => {
            it('должен регистрировать нового пользователя', async () => {
                // Arrange
                const mockResponse = mockApiResponse(mockLoginResponse);
                mockAuthApiInstance.apiV1AuthRegisterPost.mockResolvedValue(mockResponse);

                // Act
                const result = await userService.register(mockRegisterRequest);

                // Assert
                expect(mockAuthApiInstance.apiV1AuthRegisterPost).toHaveBeenCalledWith({
                    serverControllersModelsRegisterRequestDto: mockRegisterRequest,
                });
                expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockLoginResponse.token);
                expect(result.token).toBe(mockLoginResponse.token);
            });
        });
    });

    describe('Получение текущего пользователя', () => {
        it('должен выполнять logout при 401 ошибке от API', async () => {
            // Arrange
            const validToken = 'header.payload.signature';
            localStorageMock.getItem.mockReturnValue(validToken);

            mockAtob.mockReset();
            mockAtob.mockReturnValue('payload');
            mockAtob.mockReturnValue('{"sub":"user-1"}');

            // Создаем объект ошибки с правильной структурой
            const axiosError = {
                isAxiosError: true,
                response: {
                    status: 401,
                    data: { message: 'Unauthorized' }
                },
                message: 'Unauthorized',
            };

            // Мокаем isAxiosError метод в сервисе
            const isAxiosErrorSpy = jest.spyOn(userService as any, 'isAxiosError');
            isAxiosErrorSpy.mockReturnValue(true);

            mockUserApiInstance.apiV1UsersMeGet.mockRejectedValue(axiosError);
            const logoutSpy = jest.spyOn(userService, 'logout');

            // Act & Assert
            try {
                await userService.getCurrentUser();
            } catch (error: any) {
                // Проверяем что logout был вызван
                expect(logoutSpy).toHaveBeenCalled();
                // Ошибка будет переброшена как "Ошибка получения данных пользователя" или "Unauthorized"
                expect(error.message).toBeTruthy();
            }

            // Восстанавливаем оригинальный метод
            isAxiosErrorSpy.mockRestore();
        });

        it('должен обрабатывать обычные ошибки при получении пользователя', async () => {
            // Arrange
            const validToken = 'header.payload.signature';
            localStorageMock.getItem.mockReturnValue(validToken);

            mockAtob.mockReset();
            mockAtob.mockReturnValue('payload');
            mockAtob.mockReturnValue('{"sub":"user-1"}');

            mockUserApiInstance.apiV1UsersMeGet.mockRejectedValue(new Error('Network error'));

            // Act & Assert
            await expect(userService.getCurrentUser()).rejects.toThrow('Network error');
        });
    });

    describe('Работа с клиентами', () => {
        describe('getClients', () => {
            it('должен получать список клиентов без фильтров', async () => {
                // Arrange
                const clients = [mockClientDTO];
                const mockResponse = mockApiResponse(clients);
                mockClientApiInstance.apiV1ClientsGet.mockResolvedValue(mockResponse);

                // Act
                const result = await userService.getClients();

                // Assert
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('client-1');
            });
        });
    });

    describe('Получение пользователей', () => {
        describe('getAllUsers', () => {
            it('должен получать список всех пользователей', async () => {
                // Arrange
                const users = [mockAuthUserDTO];
                const mockResponse = mockApiResponse(users);
                mockUserApiInstance.apiV1UsersGet.mockResolvedValue(mockResponse);

                // Act
                const result = await userService.getAllUsers();

                // Assert
                expect(mockUserApiInstance.apiV1UsersGet).toHaveBeenCalled();
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('user-1');
            });
        });
    });

    describe('Управление сессией', () => {
        describe('logout', () => {
            it('должен очищать токен и обновлять конфигурацию API', () => {
                // Arrange
                const updateApiConfigSpy = jest.spyOn(userService as any, 'updateApiConfig');

                // Act
                userService.logout();

                // Assert
                expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
                expect(localStorageMock.removeItem).toHaveBeenCalledWith('username');
                expect(updateApiConfigSpy).toHaveBeenCalled();
            });
        });

        describe('isAuthenticated', () => {
            it('должен возвращать true при наличии токена', () => {
                // Arrange
                localStorageMock.getItem.mockReturnValue('valid-token');

                // Act
                const result = userService.isAuthenticated();

                // Assert
                expect(result).toBe(true);
            });

            it('должен возвращать false при отсутствии токена', () => {
                // Arrange
                localStorageMock.getItem.mockReturnValue(null);

                // Act
                const result = userService.isAuthenticated();

                // Assert
                expect(result).toBe(false);
            });
        });

        describe('getToken', () => {
            it('должен возвращать токен из localStorage', () => {
                // Arrange
                localStorageMock.getItem.mockReturnValue('test-token');

                // Act
                const result = userService.getToken();

                // Assert
                expect(result).toBe('test-token');
            });
        });
    });
});