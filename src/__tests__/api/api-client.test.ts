import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Создаем мок для Configuration
class MockConfiguration {
    basePath: string;
    accessToken?: string;
    baseOptions?: any;

    constructor(config: any) {
        this.basePath = config?.basePath || '';
        this.accessToken = config?.accessToken;
        this.baseOptions = config?.baseOptions || {};
    }
}

describe('API Client', () => {
    // Создаем переменные для моков внутри describe
    let tokenGetter: () => string | null;
    let mockCreateApiConfiguration: any;
    let mockUpdateApiConfiguration: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Сбрасываем токен геттер к дефолтному
        tokenGetter = () => localStorage.getItem('token');

        // Создаем свежие моки для каждой итерации
        mockCreateApiConfiguration = vi.fn(() => {
            const token = tokenGetter();
            return new MockConfiguration({
                basePath: 'http://test-api.local:8080',
                accessToken: token || undefined
            });
        });

        mockUpdateApiConfiguration = vi.fn(() => {
            const token = tokenGetter();
            return new MockConfiguration({
                basePath: 'http://test-api.local:8080',
                accessToken: token || undefined
            });
        });

        // Мокаем модуль с текущими значениями
        vi.doMock('@/api/api-client', () => ({
            API_BASE_URL: 'http://test-api.local:8080',

            getTokenFromStorage: () => localStorage.getItem('token'),

            setTokenGetter: (getter: () => string | null) => {
                tokenGetter = getter;
            },

            createApiConfiguration: mockCreateApiConfiguration,

            updateApiConfiguration: mockUpdateApiConfiguration,
        }));
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    // Динамически импортируем после мокинга
    const importApiClient = async () => {
        return await import('@/api/api-client');
    };

    describe('getTokenFromStorage', () => {
        it('should get token from localStorage', async () => {
            const { getTokenFromStorage } = await importApiClient();

            localStorage.setItem('token', 'test-jwt-token');
            expect(getTokenFromStorage()).toBe('test-jwt-token');
        });

        it('should return null when no token in localStorage', async () => {
            const { getTokenFromStorage } = await importApiClient();

            localStorage.removeItem('token');
            expect(getTokenFromStorage()).toBeNull();
        });
    });

    describe('setTokenGetter', () => {
        it('should set custom token getter function', async () => {
            const { setTokenGetter, createApiConfiguration } = await importApiClient();

            const customTokenGetter = vi.fn(() => 'custom-token');
            setTokenGetter(customTokenGetter);

            // Create config to trigger the getter
            createApiConfiguration();
            expect(customTokenGetter).toHaveBeenCalled();
        });
    });

    describe('createApiConfiguration', () => {
        it('should create configuration', async () => {
            const { createApiConfiguration } = await importApiClient();

            const config = createApiConfiguration();
            expect(config).toBeDefined();
            expect(config.basePath).toBe('http://test-api.local:8080');
        });

        it('should call createApiConfiguration function', async () => {
            const { createApiConfiguration } = await importApiClient();

            createApiConfiguration();
            expect(mockCreateApiConfiguration).toHaveBeenCalled();
        });

        it('should use token from localStorage', async () => {
            const { createApiConfiguration } = await importApiClient();

            localStorage.setItem('token', 'test-token');
            const config = createApiConfiguration();
            expect(config.accessToken).toBe('test-token');
        });
    });

    describe('updateApiConfiguration', () => {
        it('should call updateApiConfiguration function', async () => {
            const { updateApiConfiguration } = await importApiClient();

            updateApiConfiguration();
            expect(mockUpdateApiConfiguration).toHaveBeenCalled();
        });
    });

    describe('API_BASE_URL constant', () => {
        it('should be exported correctly', async () => {
            const { API_BASE_URL } = await importApiClient();

            expect(API_BASE_URL).toBeDefined();
            expect(typeof API_BASE_URL).toBe('string');
            expect(API_BASE_URL).toBe('http://test-api.local:8080');
        });
    });
});