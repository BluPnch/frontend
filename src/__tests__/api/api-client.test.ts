import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApiConfiguration, setTokenGetter, getTokenFromStorage, updateApiConfiguration, API_BASE_URL } from '@/api/api-client';

// Правильный мок для Configuration - используем класс
vi.mock('@/api/generated', () => {
    // Создаем класс для мока Configuration
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

    return {
        Configuration: MockConfiguration
    };
});

// Мок для process.env через vi.stubEnv
describe('API Client', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Устанавливаем переменные окружения перед каждым тестом
        vi.stubEnv('VITE_API_BASE_URL', 'http://test-api.local:8080');
        vi.stubEnv('VITE_API_URL', 'http://test-api.local:8080');

        // Reset the token getter
        setTokenGetter(getTokenFromStorage);
    });

    afterEach(() => {
        // Восстанавливаем оригинальные переменные окружения
        vi.unstubAllEnvs();
    });

    describe('getTokenFromStorage', () => {
        it('should get token from localStorage', () => {
            localStorage.setItem('token', 'test-jwt-token');
            expect(getTokenFromStorage()).toBe('test-jwt-token');
        });

        it('should return null when no token in localStorage', () => {
            localStorage.removeItem('token');
            expect(getTokenFromStorage()).toBeNull();
        });
    });

    describe('setTokenGetter', () => {
        it('should set custom token getter function', () => {
            const customTokenGetter = vi.fn(() => 'custom-token');
            setTokenGetter(customTokenGetter);

            // Create config to trigger the getter
            createApiConfiguration();
            expect(customTokenGetter).toHaveBeenCalled();
        });
    });

    describe('createApiConfiguration', () => {
        it('should create configuration with environment variable base URL', () => {
            localStorage.removeItem('token'); // No token
            const config = createApiConfiguration();

            expect(config.basePath).toBe('http://test-api.local:8080');
            expect(config.accessToken).toBeUndefined();
        });

        it('should create configuration with token from localStorage', () => {
            localStorage.setItem('token', 'jwt-token-123');
            const config = createApiConfiguration();

            expect(config.basePath).toBe('http://test-api.local:8080');
            expect(config.accessToken).toBe('jwt-token-123');
        });

        it('should create configuration with custom token getter', () => {
            const customTokenGetter = vi.fn(() => 'custom-jwt-token');
            setTokenGetter(customTokenGetter);

            const config = createApiConfiguration();

            expect(customTokenGetter).toHaveBeenCalled();
            expect(config.accessToken).toBe('custom-jwt-token');
        });

        it('should use default base URL when env variable is not set', () => {
            // Убираем переменные окружения для этого теста
            vi.unstubAllEnvs();

            const config = createApiConfiguration();

            expect(config.basePath).toBe('http://localhost:5097');
        });

        it('should prioritize VITE_API_BASE_URL over VITE_API_URL', () => {
            // Устанавливаем обе переменные, но VITE_API_BASE_URL должен иметь приоритет
            vi.stubEnv('VITE_API_BASE_URL', 'http://api-base-url.test');
            vi.stubEnv('VITE_API_URL', 'http://api-url.test');

            const config = createApiConfiguration();

            expect(config.basePath).toBe('http://api-base-url.test');
        });

        it('should handle token with special characters', () => {
            const complexToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

            localStorage.setItem('token', complexToken);

            const config = createApiConfiguration();

            expect(config.accessToken).toBe(complexToken);
        });
    });

    describe('updateApiConfiguration', () => {
        it('should create a new configuration', () => {
            localStorage.setItem('token', 'updated-token');
            const config = updateApiConfiguration();

            expect(config.basePath).toBe('http://test-api.local:8080');
            expect(config.accessToken).toBe('updated-token');
        });
    });

    describe('API_BASE_URL constant', () => {
        it('should be exported correctly', () => {
            expect(API_BASE_URL).toBeDefined();
            expect(typeof API_BASE_URL).toBe('string');
            // API_BASE_URL использует текущие переменные окружения
            expect(API_BASE_URL).toBe('http://test-api.local:8080');
        });
    });

    describe('console logging', () => {
        let consoleSpy: any;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('should log configuration details when creating API config', () => {
            localStorage.setItem('token', 'test-token');

            createApiConfiguration();

            expect(consoleSpy).toHaveBeenCalledWith('🔧 Creating API configuration:');
            expect(consoleSpy).toHaveBeenCalledWith('   basePath:', 'http://test-api.local:8080');
            expect(consoleSpy).toHaveBeenCalledWith('   token exists:', true);
            expect(consoleSpy).toHaveBeenCalledWith('   Configuration accessToken:', 'set');
        });

        it('should log null token when no token exists', () => {
            localStorage.removeItem('token');

            createApiConfiguration();

            expect(consoleSpy).toHaveBeenCalledWith('🔧 Creating API configuration:');
            expect(consoleSpy).toHaveBeenCalledWith('   basePath:', 'http://test-api.local:8080');
            expect(consoleSpy).toHaveBeenCalledWith('   token exists:', false);
            expect(consoleSpy).toHaveBeenCalledWith('   Configuration accessToken:', 'not set');
        });
    });
});