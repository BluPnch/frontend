import {
    AdministratorApi,
    ClientApi,
    EmployeeApi
} from '../../api/generated/api';
import type {
    ServerControllersModelsClientDTO,
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsAdministratorDTO,
    ServerControllersModelsCreateAdministratorRequestDto,
    ServerControllersModelsAuthUserDTO,
    DomainModelsEnumsEnumAuth
} from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';

class AdminService {
    private administratorApi!: AdministratorApi;
    private clientApi!: ClientApi;
    private employeeApi!: EmployeeApi;

    constructor() {
        this.initializeApis();
    }

    private initializeApis() {
        const config = createApiConfiguration();
        this.administratorApi = new AdministratorApi(config);
        this.clientApi = new ClientApi(config);
        this.employeeApi = new EmployeeApi(config);
    }

    private updateApiConfig() {
        const config = createApiConfiguration();
        this.administratorApi = new AdministratorApi(config);
        this.clientApi = new ClientApi(config);
        this.employeeApi = new EmployeeApi(config);
    }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

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

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка получения списка администраторов');
            } else {
                throw new Error('Неизвестная ошибка при получении списка администраторов');
            }
        }
    }

    async getAdministratorById(id: string): Promise<ServerControllersModelsAdministratorDTO> {
        try {
            const response = await this.administratorApi.apiV1AdministratorsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get administrator:', error);

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка получения данных администратора');
            } else {
                throw new Error('Неизвестная ошибка при получении данных администратора');
            }
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

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка создания администратора');
            } else {
                throw new Error('Неизвестная ошибка при создании администратора');
            }
        }
    }

    async getClients(companyName?: string, phoneNumber?: string): Promise<ServerControllersModelsClientDTO[]> {
        try {
            const response = await this.clientApi.apiV1ClientsGet({
                companyName,
                phoneNumber
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get clients:', error);

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка получения списка клиентов');
            } else {
                throw new Error('Неизвестная ошибка при получении списка клиентов');
            }
        }
    }

    async getClientById(id: string): Promise<ServerControllersModelsClientDTO> {
        try {
            const response = await this.clientApi.apiV1ClientsIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get client:', error);

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка получения данных клиента');
            } else {
                throw new Error('Неизвестная ошибка при получении данных клиента');
            }
        }
    }

    async updateUserRole(clientId: string, newRole: DomainModelsEnumsEnumAuth): Promise<ServerControllersModelsAuthUserDTO> {
        try {
            const response = await this.clientApi.apiV1ClientsClientIdRolePatch({
                clientId,
                serverControllersModelsUpdateUserRoleRequestDto: { newRole }
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to update user role:', error);

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка обновления роли пользователя');
            } else {
                throw new Error('Неизвестная ошибка при обновлении роли пользователя');
            }
        }
    }

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

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка получения списка сотрудников');
            } else {
                throw new Error('Неизвестная ошибка при получении списка сотрудников');
            }
        }
    }

    async getEmployeeById(id: string): Promise<ServerControllersModelsEmployeeDTO> {
        try {
            const response = await this.employeeApi.apiV1EmployeesIdGet({ id });
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to get employee:', error);

            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка получения данных сотрудника');
            } else {
                throw new Error('Неизвестная ошибка при получении данных сотрудника');
            }
        }
    }
}

export const adminService = new AdminService();