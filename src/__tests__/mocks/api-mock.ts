import { vi } from 'vitest';

export const createMockApi = () => {
    const mockApiInstance = {
        apiV1PlantsGet: vi.fn(),
        apiV1PlantsIdGet: vi.fn(),
        apiV1PlantsPost: vi.fn(),
        apiV1PlantsIdPut: vi.fn(),
        apiV1PlantsIdDelete: vi.fn(),
        apiV1UsersMeGet: vi.fn(),
        apiV1ClientsIdGet: vi.fn(),
        apiV1ClientsPlantsGet: vi.fn(),
        apiV1ClientsJournalRecordsGet: vi.fn(),
        apiV1SeedsGet: vi.fn(),
        apiV1SeedsIdGet: vi.fn(),
        apiV1SeedsPost: vi.fn(),
        apiV1SeedsIdPut: vi.fn(),
        apiV1SeedsIdDelete: vi.fn(),
        apiV1JournalRecordsGet: vi.fn(),
        apiV1JournalRecordsIdGet: vi.fn(),
        apiV1JournalRecordsPost: vi.fn(),
        apiV1JournalRecordsIdPut: vi.fn(),
        apiV1JournalRecordsIdDelete: vi.fn(),
        apiV1AuthLoginPost: vi.fn(),
        apiV1AuthRegisterPost: vi.fn(),
    };

    return mockApiInstance;
};

// Mock конструкторы
export const PlantApi = vi.fn();
export const UserApi = vi.fn();
export const ClientApi = vi.fn();
export const SeedApi = vi.fn();
export const JournalRecordApi = vi.fn();
export const AuthApi = vi.fn();
export const Configuration = vi.fn();

// Экспортируем все
export default {
    PlantApi,
    UserApi,
    ClientApi,
    SeedApi,
    JournalRecordApi,
    AuthApi,
    Configuration,
    createMockApi,
};