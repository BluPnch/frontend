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
    private administratorApi: AdministratorApi;
    private clientApi: ClientApi;
    private employeeApi: EmployeeApi;

    constructor() {
        const config = createApiConfiguration();
        this.administratorApi = new AdministratorApi(config);
        this.clientApi = new ClientApi(config);
        this.employeeApi = new EmployeeApi(config);
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
        } catch (error) {
            console.error('Failed to get administrators:', error);
            throw error;
        }
    }

    async getAdministratorById(id: string): Promise<ServerControllersModelsAdministratorDTO> {
        try {
            const response = await this.administratorApi.apiV1AdministratorsIdGet({ id });
            return response.data;
        } catch (error) {
            console.error('Failed to get administrator:', error);
            throw error;
        }
    }

    async createAdministrator(data: ServerControllersModelsCreateAdministratorRequestDto): Promise<ServerControllersModelsAdministratorDTO> {
        try {
            const response = await this.administratorApi.apiV1AdministratorsPost({
                serverControllersModelsCreateAdministratorRequestDto: data
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create administrator:', error);
            throw error;
        }
    }

    async getClients(companyName?: string, phoneNumber?: string): Promise<ServerControllersModelsClientDTO[]> {
        try {
            const response = await this.clientApi.apiV1ClientsGet({
                companyName,
                phoneNumber
            });
            return response.data;
        } catch (error) {
            console.error('Failed to get clients:', error);
            throw error;
        }
    }

    async getClientById(id: string): Promise<ServerControllersModelsClientDTO> {
        try {
            const response = await this.clientApi.apiV1ClientsIdGet({ id });
            return response.data;
        } catch (error) {
            console.error('Failed to get client:', error);
            throw error;
        }
    }

    async updateUserRole(clientId: string, newRole: DomainModelsEnumsEnumAuth): Promise<ServerControllersModelsAuthUserDTO> {
        try {
            const response = await this.clientApi.apiV1ClientsClientIdRolePatch({
                clientId,
                serverControllersModelsUpdateUserRoleRequestDto: { newRole }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to update user role:', error);
            throw error;
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
        } catch (error) {
            console.error('Failed to get employees:', error);
            throw error;
        }
    }

    async getEmployeeById(id: string): Promise<ServerControllersModelsEmployeeDTO> {
        try {
            const response = await this.employeeApi.apiV1EmployeesIdGet({ id });
            return response.data;
        } catch (error) {
            console.error('Failed to get employee:', error);
            throw error;
        }
    }
}

export const adminService = new AdminService();