import {
    AdministratorApi,
    ClientApi,
    EmployeeApi,
    UserApi
} from '../../api/generated/api';
import type {
    ServerControllersModelsClientDTO,
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsAdministratorDTO,
    ServerControllersModelsCreateAdministratorRequestDto,
    ServerControllersModelsAuthUserDTO,
    DomainModelsEnumsEnumAuth,
    ServerControllersModelsUpdateUserRoleRequestDto
} from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';

class AdminService {
    private administratorApi!: AdministratorApi;
    private clientApi!: ClientApi;
    private employeeApi!: EmployeeApi;
    private userApi!: UserApi;

    constructor() {
        this.initializeApis();
    }

    private initializeApis() {
        const config = createApiConfiguration();
        this.administratorApi = new AdministratorApi(config);
        this.clientApi = new ClientApi(config);
        this.employeeApi = new EmployeeApi(config);
        this.userApi = new UserApi(config);
    }

    private updateApiConfig() {
        const config = createApiConfiguration();
        this.administratorApi = new AdministratorApi(config);
        this.clientApi = new ClientApi(config);
        this.employeeApi = new EmployeeApi(config);
        this.userApi = new UserApi(config);
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Администраторы
    async getAdministrators(surname?: string, name?: string, patronymic?: string, phoneNumber?: string): Promise<ServerControllersModelsAdministratorDTO[]> {
        try {
            const response = await this.administratorApi.apiV1AdministratorsGet({
                surname,
                name,
                patronymic,
                phoneNumber
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get administrators:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения списка администраторов');
        }
    }

    async getAdministratorById(id: string): Promise<ServerControllersModelsAdministratorDTO> {
        try {
            const response = await this.administratorApi.apiV1AdministratorsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get administrator:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных администратора');
        }
    }

    async createAdministrator(data: ServerControllersModelsCreateAdministratorRequestDto): Promise<ServerControllersModelsAdministratorDTO> {
        try {
            const response = await this.administratorApi.apiV1AdministratorsPost({
                serverControllersModelsCreateAdministratorRequestDto: data
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to create administrator:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка создания администратора');
        }
    }

    // Клиенты
    async getClients(companyName?: string, phoneNumber?: string): Promise<ServerControllersModelsClientDTO[]> {
        try {
            const response = await this.clientApi.apiV1ClientsGet({
                companyName,
                phoneNumber
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get clients:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения списка клиентов');
        }
    }

    async getClientById(id: string): Promise<ServerControllersModelsClientDTO> {
        try {
            const response = await this.clientApi.apiV1ClientsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get client:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных клиента');
        }
    }

    async updateUserRole(clientId: string, newRole: DomainModelsEnumsEnumAuth): Promise<ServerControllersModelsAuthUserDTO> {
        try {
            const updateData: ServerControllersModelsUpdateUserRoleRequestDto = { newRole };

            const response = await this.clientApi.apiV1ClientsClientIdRolePatch({
                clientId,
                serverControllersModelsUpdateUserRoleRequestDto: updateData
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to update user role:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка обновления роли пользователя');
        }
    }

    // Сотрудники
    async getEmployees(phoneNumber?: string, task?: string, plantDomain?: string): Promise<ServerControllersModelsEmployeeDTO[]> {
        try {
            const response = await this.employeeApi.apiV1EmployeesGet({
                phoneNumber,
                task,
                plantDomain
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get employees:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения списка сотрудников');
        }
    }

    async getEmployeeById(id: string): Promise<ServerControllersModelsEmployeeDTO> {
        try {
            const response = await this.employeeApi.apiV1EmployeesIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get employee:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения данных сотрудника');
        }
    }

    // Новые методы для работы с растениями сотрудников
    async getEmployeePlants(employeeId?: string): Promise<any[]> {
        try {
            const response = await this.employeeApi.apiV1EmployeesPlantsGet({
                employeeId
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get employee plants:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения растений сотрудника');
        }
    }

    // Новые методы для работы с журналом клиентов
    async getClientJournalRecords(): Promise<any[]> {
        try {
            const response = await this.clientApi.apiV1ClientsJournalRecordsGet();
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get client journal records:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения записей журнала клиента');
        }
    }

    async getClientPlants(): Promise<any[]> {
        try {
            const response = await this.clientApi.apiV1ClientsPlantsGet();
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get client plants:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения растений клиента');
        }
    }

    // Методы для работы со всеми пользователями
    async getAllUsers(): Promise<ServerControllersModelsAuthUserDTO[]> {
        try {
            const response = await this.userApi.apiV1UsersGet();
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get all users:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения списка пользователей');
        }
    }

    // Удаление пользователей (если нужно)
    async deleteUser(userId: string): Promise<void> {
        try {
            // Этот метод может потребовать дополнительной реализации на бэкенде
            // В текущем API нет прямого метода удаления пользователя
            throw new Error('Метод удаления пользователя не реализован');
        } catch (error: unknown) {
            console.error('Failed to delete user:', error);
            throw new Error(error instanceof Error ? error.message : 'Ошибка удаления пользователя');
        }
    }
}

export const adminService = new AdminService();