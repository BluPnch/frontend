import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '@/core/services/user-service';

vi.mock('@/api/generated', () => ({
    Configuration: vi.fn().mockImplementation((config) => ({
        basePath: config?.basePath || '',
        accessToken: config?.accessToken,
        baseOptions: config?.baseOptions || {}
    }))
}));

vi.mock('@/api/generated/api', () => ({
    AuthApi: vi.fn(() => ({
        apiV1AuthLoginPost: vi.fn(),
    })),
}));


describe('UserService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        (userService as any).initializeApis();
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const mockResponse = {
                token: 'jwt-token',
                user: { id: '1', username: 'test' }
            };

            const mockAuthApi = (userService as any).authApi;
            mockAuthApi.apiV1AuthLoginPost.mockResolvedValue({
                data: mockResponse
            });

            const result = await userService.login('test', 'pass');
            expect(result).toEqual(mockResponse);
        });
    });
});