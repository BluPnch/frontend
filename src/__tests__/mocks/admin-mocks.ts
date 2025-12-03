import type {
    ServerControllersModelsClientDTO,
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsAdministratorDTO,
    ServerControllersModelsCreateAdministratorRequestDto,
    ServerControllersModelsAuthUserDTO,
    DomainModelsEnumsEnumAuth,
    ServerControllersModelsUpdateUserRoleRequestDto
} from '../../api/generated/api';

export const mockAdministratorDTO: ServerControllersModelsAdministratorDTO = {
    id: 'admin-1',
    surname: 'Иванов',
    name: 'Иван',
    patronymic: 'Иванович',
    phoneNumber: '+1234567890',
};

export const mockCreateAdministratorRequest: ServerControllersModelsCreateAdministratorRequestDto = {
    surname: 'Иванов',
    name: 'Иван',
    patronymic: 'Иванович',
    phoneNumber: '+1234567890',
    password: 'password123',
};

export const mockClientDTO: ServerControllersModelsClientDTO = {
    id: 'client-1',
    companyName: 'Test Company',
    phoneNumber: '+0987654321',
};

export const mockEmployeeDTO: ServerControllersModelsEmployeeDTO = {
    id: 'emp-1',
    surname: 'Петров',
    name: 'Петр',
    patronymic: 'Петрович',
    phoneNumber: '+1122334455',
    task: 'gardener',
    plantDomain: 'greenhouse-1',
    administratorId: 'admin-1',
};

export const mockAuthUserDTO: ServerControllersModelsAuthUserDTO = {
    id: 'user-1',
    username: 'admin_user',
    role: 0,
};

export const mockUpdateUserRoleRequest: ServerControllersModelsUpdateUserRoleRequestDto = {
    newRole: 1 as DomainModelsEnumsEnumAuth,
};

export const mockAdministratorsDTO: ServerControllersModelsAdministratorDTO[] = [
    mockAdministratorDTO,
    {
        id: 'admin-2',
        surname: 'Петров',
        name: 'Петр',
        patronymic: 'Петрович',
        phoneNumber: '+0987654321',
    },
];

export const mockClientsDTO: ServerControllersModelsClientDTO[] = [
    mockClientDTO,
    {
        id: 'client-2',
        companyName: 'Another Company',
        phoneNumber: '+1122334455',
    },
];

export const mockUsersDTO: ServerControllersModelsAuthUserDTO[] = [
    mockAuthUserDTO,
    {
        id: 'user-1',
        username: 'admin_user',
        role: 0,
    },
];