import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Configuration
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

// Mock AuthApi
const mockAuthApi = {
    apiV1AuthLoginPost: vi.fn(),
    apiV1AuthRegisterPost: vi.fn(),
};

vi.mock('@/api/generated/api', () => ({
    AuthApi: vi.fn(() => mockAuthApi),
}));

// Mock axios
vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() }
            }
        }))
    }
}));

describe('UserService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Reset mock implementations
        mockAuthApi.apiV1AuthLoginPost.mockReset();
        mockAuthApi.apiV1AuthRegisterPost.mockReset();

        // Set mock implementation
        (require('@/api/generated/api').AuthApi as any).mockImplementation(() => mockAuthApi);
    });

    const createTestInstance = () => {
        const UserService = require('@/core/services/user-service').UserService;
        const instance = new UserService();

        // Manually set the authApi for testing
        (instance as any).authApi = mockAuthApi;

        return instance;
    };

    describe('login', () => {
        it('should login successfully', async () => {
            const instance = createTestInstance();

            const mockResponse = {
                token: 'jwt-token',
                user: { id: '1', username: 'test' }
            };

            mockAuthApi.apiV1AuthLoginPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await instance.login('test', 'pass');
            expect(result).toEqual(mockResponse);
        });

        it('should throw error when login fails', async () => {
            const instance = createTestInstance();

            mockAuthApi.apiV1AuthLoginPost.mockRejectedValue(new Error('Invalid credentials'));

            await expect(instance.login('test', 'wrong')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('register', () => {
        it('should register successfully', async () => {
            const instance = createTestInstance();

            const mockResponse = {
                token: 'jwt-token',
                user: { id: '1', username: 'newuser' }
            };

            mockAuthApi.apiV1AuthRegisterPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await instance.register('newuser', 'password123', '+79991234567');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('token management', () => {
        it('should get token from localStorage', () => {
            const instance = createTestInstance();

            localStorage.setItem('token', 'user-service-token');

            const token = (instance as any).getToken();
            expect(token).toBe('user-service-token');
        });

        it('should return null when no token', () => {
            const instance = createTestInstance();

            localStorage.removeItem('token');

            const token = (instance as any).getToken();
            expect(token).toBeNull();
        });
    });
});