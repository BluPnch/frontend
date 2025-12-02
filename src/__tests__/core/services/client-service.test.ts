import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientService } from '@/core/services/client-service';
import type {
    ServerControllersModelsUserDTO
} from '@/api/generated/api';

// Mock modules
vi.mock('@/api/generated', () => ({
    Configuration: vi.fn().mockImplementation((config) => ({
        basePath: config?.basePath || '',
        accessToken: config?.accessToken,
        baseOptions: config?.baseOptions || {}
    }))
}));

vi.mock('@/api/generated/api', () => ({
    UserApi: vi.fn(() => ({
        apiV1UsersMeGet: vi.fn(),
    })),
    PlantApi: vi.fn(() => ({
        apiV1PlantsGet: vi.fn(),
        apiV1PlantsIdGet: vi.fn(),
    })),
    JournalRecordApi: vi.fn(() => ({
        apiV1JournalRecordsGet: vi.fn(),
        apiV1JournalRecordsPost: vi.fn(),
    })),
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