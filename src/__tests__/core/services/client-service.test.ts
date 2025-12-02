import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientService } from '@/core/services/client-service';
import type {
    ServerControllersModelsUserDTO
} from '@/api/generated/api';

// Mock modules
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

describe('ClientService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        (clientService as any).initializeApis();
    });

    describe('getMyProfile', () => {
        it('should fetch client profile', async () => {
            // Используйте только те поля, которые определены в интерфейсе
            const mockProfile: ServerControllersModelsUserDTO = {
                id: 'client123',
                phoneNumber: '+79991234567'
                // username не существует в типе ServerControllersModelsUserDTO
            };

            const mockUserApi = (clientService as any).userApi;
            mockUserApi.apiV1UsersMeGet.mockResolvedValue({
                data: mockProfile
            });

            const result = await clientService.getMyProfile();
            expect(result).toEqual(mockProfile);
        });
    });
});