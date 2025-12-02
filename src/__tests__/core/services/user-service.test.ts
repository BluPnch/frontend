import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '@/core/services/user-service';

vi.mock('@/api/generated/api', () => import('../../__mocks__/api'));

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