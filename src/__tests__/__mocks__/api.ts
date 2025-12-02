import { vi } from 'vitest';

// Создаем класс-конструктор для мока Configuration
export class MockConfiguration {
    basePath: string;
    accessToken?: string;
    baseOptions?: any;

    constructor(config: any) {
        this.basePath = config.basePath || '';
        this.accessToken = config.accessToken;
        this.baseOptions = config.baseOptions || {};
    }
}

// Создаем фабрики для API классов
export const createMockApiClass = (methods: Record<string, any>) => {
    return class MockApiClass {
        constructor() {
            Object.assign(this, methods);
        }
    };
};

// Экспортируем моки как именованные экспорты
export const Configuration = vi.fn().mockImplementation((config) => ({
    basePath: config?.basePath || '',
    accessToken: config?.accessToken,
    baseOptions: config?.baseOptions || {}
}));


export const AdministratorApi = vi.fn().mockImplementation(() => ({
    apiV1AdministratorsGet: vi.fn(),
    apiV1AdministratorsIdGet: vi.fn(),
    apiV1AdministratorsPost: vi.fn(),
}));

export const ClientApi = vi.fn().mockImplementation(() => ({
    apiV1ClientsGet: vi.fn(),
    apiV1ClientsIdGet: vi.fn(),
    apiV1ClientsClientIdRolePatch: vi.fn(),
    apiV1ClientsJournalRecordsGet: vi.fn(),
    apiV1ClientsPlantsGet: vi.fn(),
}));

export const EmployeeApi = vi.fn().mockImplementation(() => ({
    apiV1EmployeesGet: vi.fn(),
    apiV1EmployeesIdGet: vi.fn(),
    apiV1EmployeesPlantsGet: vi.fn(),
}));

export const UserApi = vi.fn().mockImplementation(() => ({
    apiV1UsersMeGet: vi.fn(),
    apiV1UsersGet: vi.fn(),
}));

export const PlantApi = vi.fn().mockImplementation(() => ({
    apiV1PlantsGet: vi.fn(),
    apiV1PlantsIdGet: vi.fn(),
    apiV1PlantsPost: vi.fn(),
    apiV1PlantsIdPut: vi.fn(),
    apiV1PlantsIdDelete: vi.fn(),
}));

export const SeedApi = vi.fn().mockImplementation(() => ({
    apiV1SeedsGet: vi.fn(),
    apiV1SeedsIdGet: vi.fn(),
    apiV1SeedsPost: vi.fn(),
    apiV1SeedsIdPut: vi.fn(),
    apiV1SeedsIdDelete: vi.fn(),
}));

export const JournalRecordApi = vi.fn().mockImplementation(() => ({
    apiV1JournalRecordsGet: vi.fn(),
    apiV1JournalRecordsIdGet: vi.fn(),
    apiV1JournalRecordsPost: vi.fn(),
    apiV1JournalRecordsIdPut: vi.fn(),
    apiV1JournalRecordsIdDelete: vi.fn(),
}));

export const GrowthStageApi = vi.fn().mockImplementation(() => ({
    apiV1GrowthStagesGet: vi.fn(),
    apiV1GrowthStagesIdGet: vi.fn(),
}));

export const AuthApi = vi.fn().mockImplementation(() => ({
    apiV1AuthLoginPost: vi.fn(),
    apiV1AuthRegisterPost: vi.fn(),
}));