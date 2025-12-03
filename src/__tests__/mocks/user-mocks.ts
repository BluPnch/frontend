import type {
    ServerControllersModelsUserDTO,
    ServerControllersModelsAuthUserDTO,
    ServerControllersModelsLoginRequestDto,
    ServerControllersModelsRegisterRequestDto,
    ServerControllersModelsLoginResponseDto,
    ServerControllersModelsClientDTO
} from '../../api/generated/api';

export const mockLoginRequest: ServerControllersModelsLoginRequestDto = {
    username: 'testuser',
    password: 'password123',
};

export const mockLoginResponse: ServerControllersModelsLoginResponseDto = {
    username: 'testuser',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE3MzQwMDAwMDB9.signature',
};

export const mockRegisterRequest: ServerControllersModelsRegisterRequestDto = {
    email: 'newuser@example.com',
    password: 'password123',
};

export const mockUserDTO: ServerControllersModelsUserDTO = {
    id: 'user-1',
    phoneNumber: '+1234567890',
};

export const mockAuthUserDTO: ServerControllersModelsAuthUserDTO = {
    id: 'user-1',
    username: 'testuser',
    role: 1 as any,
};

export const mockClientDTO: ServerControllersModelsClientDTO = {
    id: 'client-1',
    companyName: 'Test Company',
    phoneNumber: '+0987654321',
};

export const mockUsersDTO: ServerControllersModelsAuthUserDTO[] = [
    mockAuthUserDTO,
    {
        id: 'user-2',
        username: 'anotheruser',
        role: 2 as any,
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

export const mockValidJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE3MzQwMDAwMDB9.signature';

export const mockExpiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjE2NzI1NjAwMDB9.signature';
