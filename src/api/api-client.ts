import {
    Configuration,
    AdministratorApi,
    AuthApi,
    ClientApi,
    EmployeeApi,
    GrowthStageApi,
    JournalRecordApi,
    PlantApi,
    SeedApi,
    UserApi
} from './generated';

// Базовый URL для API
const basePath = import.meta.env.VITE_API_URL || 'http://localhost:5097/api/v1';

// Токен для авторизации
let authToken: string | null = null;

// Функция для установки токена
export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// Создаем конфигурацию с токеном
const createConfig = () => {
    return new Configuration({
        basePath,
        apiKey: authToken ? `Bearer ${authToken}` : undefined,
    });
};

// Создаем экземпляры API
const createApiInstances = () => {
    const config = createConfig();
    return {
        administratorApi: new AdministratorApi(config),
        authApi: new AuthApi(config),
        clientApi: new ClientApi(config),
        employeeApi: new EmployeeApi(config),
        growthStageApi: new GrowthStageApi(config),
        journalRecordApi: new JournalRecordApi(config),
        plantApi: new PlantApi(config),
        seedApi: new SeedApi(config),
        userApi: new UserApi(config),
    };
};

// Типы для удобства
export type ApiResponse<T> = {
    data: T;
    status: number;
    statusText: string;
};

export type ApiError = {
    message: string;
    status: number;
    code?: string;
};

// Упрощенный фасад для удобства использования
export const api = {
    auth: {
        login: async (loginData: any): Promise<ApiResponse<any>> => {
            const { authApi } = createApiInstances();
            return handleApiCall(() => authApi.apiV1AuthLoginPost({ serverControllersModelsLoginRequestDto: loginData }));
        },
        register: async (registerData: any): Promise<ApiResponse<any>> => {
            const { authApi } = createApiInstances();
            return handleApiCall(() => authApi.apiV1AuthRegisterPost({ serverControllersModelsRegisterRequestDto: registerData }));
        },
    },

    users: {
        getMe: async (): Promise<ApiResponse<any>> => {
            const { userApi } = createApiInstances();
            return handleApiCall(() => userApi.apiV1UsersMeGet());
        },
        getAll: async (): Promise<ApiResponse<any[]>> => {
            const { userApi } = createApiInstances();
            return handleApiCall(() => userApi.apiV1UsersGet());
        },
    },

    administrators: {
        getAll: async (filters?: { surname?: string; name?: string; patronymic?: string; phoneNumber?: string }): Promise<ApiResponse<any[]>> => {
            const { administratorApi } = createApiInstances();
            return handleApiCall(() => administratorApi.apiV1AdministratorsGet(filters || {}));
        },
        getById: async (id: string): Promise<ApiResponse<any>> => {
            const { administratorApi } = createApiInstances();
            return handleApiCall(() => administratorApi.apiV1AdministratorsIdGet({ id }));
        },
        create: async (adminData: any): Promise<ApiResponse<any>> => {
            const { administratorApi } = createApiInstances();
            return handleApiCall(() => administratorApi.apiV1AdministratorsPost({ serverControllersModelsCreateAdministratorRequestDto: adminData }));
        },
    },

    clients: {
        getAll: async (filters?: { companyName?: string; phoneNumber?: string }): Promise<ApiResponse<any[]>> => {
            const { clientApi } = createApiInstances();
            return handleApiCall(() => clientApi.apiV1ClientsGet(filters || {}));
        },
        getById: async (id: string): Promise<ApiResponse<any>> => {
            const { clientApi } = createApiInstances();
            return handleApiCall(() => clientApi.apiV1ClientsIdGet({ id }));
        },
        getPlants: async (): Promise<ApiResponse<any[]>> => {
            const { clientApi } = createApiInstances();
            return handleApiCall(() => clientApi.apiV1ClientsPlantsGet());
        },
        getJournalRecords: async (): Promise<ApiResponse<any[]>> => {
            const { clientApi } = createApiInstances();
            return handleApiCall(() => clientApi.apiV1ClientsJournalRecordsGet());
        },
        updateRole: async (clientId: string, roleData: any): Promise<ApiResponse<any>> => {
            const { clientApi } = createApiInstances();
            return handleApiCall(() => clientApi.apiV1ClientsClientIdRolePatch({
                clientId,
                serverControllersModelsUpdateUserRoleRequestDto: roleData
            }));
        },
    },

    employees: {
        getAll: async (filters?: { phoneNumber?: string; task?: string; plantDomain?: string }): Promise<ApiResponse<any[]>> => {
            const { employeeApi } = createApiInstances();
            return handleApiCall(() => employeeApi.apiV1EmployeesGet(filters || {}));
        },
        getById: async (id: string): Promise<ApiResponse<any>> => {
            const { employeeApi } = createApiInstances();
            return handleApiCall(() => employeeApi.apiV1EmployeesIdGet({ id }));
        },
        getPlants: async (employeeId?: string): Promise<ApiResponse<any[]>> => {
            const { employeeApi } = createApiInstances();
            return handleApiCall(() => employeeApi.apiV1EmployeesPlantsGet({ employeeId }));
        },
    },

    plants: {
        getAll: async (filters?: { family?: string; species?: string }): Promise<ApiResponse<any[]>> => {
            const { plantApi } = createApiInstances();
            return handleApiCall(() => plantApi.apiV1PlantsGet(filters || {}));
        },
        getById: async (id: string): Promise<ApiResponse<any>> => {
            const { plantApi } = createApiInstances();
            return handleApiCall(() => plantApi.apiV1PlantsIdGet({ id }));
        },
        create: async (plantData: any): Promise<ApiResponse<any>> => {
            const { plantApi } = createApiInstances();
            return handleApiCall(() => plantApi.apiV1PlantsPost({ serverControllersModelsPlantDTO: plantData }));
        },
        update: async (id: string, plantData: any): Promise<ApiResponse<void>> => {
            const { plantApi } = createApiInstances();
            return handleApiCall(() => plantApi.apiV1PlantsIdPut({ id, serverControllersModelsPlantDTO: plantData }));
        },
        delete: async (id: string): Promise<ApiResponse<void>> => {
            const { plantApi } = createApiInstances();
            return handleApiCall(() => plantApi.apiV1PlantsIdDelete({ id }));
        },
    },

    seeds: {
        getAll: async (filters?: { maturity?: string; viability?: string }): Promise<ApiResponse<any[]>> => {
            const { seedApi } = createApiInstances();
            return handleApiCall(() => seedApi.apiV1SeedsGet(filters || {}));
        },
        getById: async (id: string): Promise<ApiResponse<any>> => {
            const { seedApi } = createApiInstances();
            return handleApiCall(() => seedApi.apiV1SeedsIdGet({ id }));
        },
        create: async (seedData: any): Promise<ApiResponse<any>> => {
            const { seedApi } = createApiInstances();
            return handleApiCall(() => seedApi.apiV1SeedsPost({ serverControllersModelsSeedDTO: seedData }));
        },
        update: async (id: string, seedData: any): Promise<ApiResponse<void>> => {
            const { seedApi } = createApiInstances();
            return handleApiCall(() => seedApi.apiV1SeedsIdPut({ id, serverControllersModelsSeedDTO: seedData }));
        },
        delete: async (id: string): Promise<ApiResponse<void>> => {
            const { seedApi } = createApiInstances();
            return handleApiCall(() => seedApi.apiV1SeedsIdDelete({ id }));
        },
    },

    journalRecords: {
        getAll: async (filters?: { plantId?: string; startDate?: string; endDate?: string }): Promise<ApiResponse<any[]>> => {
            const { journalRecordApi } = createApiInstances();
            return handleApiCall(() => journalRecordApi.apiV1JournalRecordsGet(filters || {}));
        },
        getById: async (id: string): Promise<ApiResponse<any>> => {
            const { journalRecordApi } = createApiInstances();
            return handleApiCall(() => journalRecordApi.apiV1JournalRecordsIdGet({ id }));
        },
        create: async (recordData: any): Promise<ApiResponse<any>> => {
            const { journalRecordApi } = createApiInstances();
            return handleApiCall(() => journalRecordApi.apiV1JournalRecordsPost({ serverControllersModelsJournalRecordDTO: recordData }));
        },
        update: async (id: string, recordData: any): Promise<ApiResponse<void>> => {
            const { journalRecordApi } = createApiInstances();
            return handleApiCall(() => journalRecordApi.apiV1JournalRecordsIdPut({ id, serverControllersModelsJournalRecordDTO: recordData }));
        },
        delete: async (id: string): Promise<ApiResponse<void>> => {
            const { journalRecordApi } = createApiInstances();
            return handleApiCall(() => journalRecordApi.apiV1JournalRecordsIdDelete({ id }));
        },
    },

    growthStages: {
        getAll: async (name?: string): Promise<ApiResponse<any[]>> => {
            const { growthStageApi } = createApiInstances();
            return handleApiCall(() => growthStageApi.apiV1GrowthStagesGet({ name }));
        },
        getById: async (id: string): Promise<ApiResponse<any>> => {
            const { growthStageApi } = createApiInstances();
            return handleApiCall(() => growthStageApi.apiV1GrowthStagesIdGet({ id }));
        },
    },
};

// Вспомогательная функция для обработки API вызовов
async function handleApiCall<T>(apiCall: () => Promise<{ data: T }>): Promise<ApiResponse<T>> {
    try {
        const response = await apiCall();
        return {
            data: response.data,
            status: 200,
            statusText: 'OK',
        };
    } catch (error: any) {
        console.error('API call failed:', error);

        // Упрощенная обработка ошибок
        throw {
            message: error.message || 'Unknown error occurred',
            status: error.status || -1,
            code: 'API_ERROR',
        } as ApiError;
    }
}

// Утилиты для работы с API
export const apiUtils = {
    // Проверка, является ли ошибка API ошибкой
    isApiError: (error: any): error is ApiError => {
        return error && typeof error === 'object' && 'message' in error && 'status' in error;
    },

    // Получение сообщения об ошибке
    getErrorMessage: (error: any): string => {
        if (apiUtils.isApiError(error)) {
            return error.message;
        }
        return error?.message || 'An unexpected error occurred';
    },

    // Очистка токена
    clearAuth: () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
    },
};

export default api;