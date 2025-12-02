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

// Создаем правильные конструкторы для API классов
const createMockApiClass = (methods: Record<string, any>) => {
    return vi.fn().mockImplementation(() => {
        // Создаем объект с методами
        const instance = {};

        // Копируем все методы в инстанс
        Object.keys(methods).forEach(key => {
            (instance as any)[key] = vi.fn().mockImplementation(methods[key]);
        });

        return instance;
    });
};

// Экспортируем моки как конструкторы
export const Configuration = vi.fn().mockImplementation((config) => {
    return new MockConfiguration(config);
});

// Создаем конструкторы API классов с методами как vi.fn()
export const AdministratorApi = createMockApiClass({
    apiV1AdministratorsGet: () => Promise.resolve({ data: [] }),
    apiV1AdministratorsIdGet: () => Promise.resolve({ data: {} }),
    apiV1AdministratorsPost: () => Promise.resolve({ data: {} }),
});

export const ClientApi = createMockApiClass({
    apiV1ClientsGet: () => Promise.resolve({ data: [] }),
    apiV1ClientsIdGet: () => Promise.resolve({ data: {} }),
    apiV1ClientsClientIdRolePatch: () => Promise.resolve({ data: {} }),
    apiV1ClientsJournalRecordsGet: () => Promise.resolve({ data: [] }),
    apiV1ClientsPlantsGet: () => Promise.resolve({ data: [] }),
});

export const EmployeeApi = createMockApiClass({
    apiV1EmployeesGet: () => Promise.resolve({ data: [] }),
    apiV1EmployeesIdGet: () => Promise.resolve({ data: {} }),
    apiV1EmployeesPlantsGet: () => Promise.resolve({ data: [] }),
});

export const UserApi = createMockApiClass({
    apiV1UsersMeGet: () => Promise.resolve({ data: {} }),
    apiV1UsersGet: () => Promise.resolve({ data: [] }),
});

export const PlantApi = createMockApiClass({
    apiV1PlantsGet: () => Promise.resolve({ data: [] }),
    apiV1PlantsIdGet: () => Promise.resolve({ data: {} }),
    apiV1PlantsPost: () => Promise.resolve({ data: {} }),
    apiV1PlantsIdPut: () => Promise.resolve({}),
    apiV1PlantsIdDelete: () => Promise.resolve({}),
});

export const SeedApi = createMockApiClass({
    apiV1SeedsGet: () => Promise.resolve({ data: [] }),
    apiV1SeedsIdGet: () => Promise.resolve({ data: {} }),
    apiV1SeedsPost: () => Promise.resolve({ data: {} }),
    apiV1SeedsIdPut: () => Promise.resolve({}),
    apiV1SeedsIdDelete: () => Promise.resolve({}),
});

export const JournalRecordApi = createMockApiClass({
    apiV1JournalRecordsGet: () => Promise.resolve({ data: [] }),
    apiV1JournalRecordsIdGet: () => Promise.resolve({ data: {} }),
    apiV1JournalRecordsPost: () => Promise.resolve({ data: {} }),
    apiV1JournalRecordsIdPut: () => Promise.resolve({}),
    apiV1JournalRecordsIdDelete: () => Promise.resolve({}),
});

export const GrowthStageApi = createMockApiClass({
    apiV1GrowthStagesGet: () => Promise.resolve({ data: [] }),
    apiV1GrowthStagesIdGet: () => Promise.resolve({ data: {} }),
});

export const AuthApi = createMockApiClass({
    apiV1AuthLoginPost: () => Promise.resolve({ data: {} }),
    apiV1AuthRegisterPost: () => Promise.resolve({ data: {} }),
});