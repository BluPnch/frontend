import type {
    ServerControllersModelsUserDTO,
    ServerControllersModelsAuthUserDTO,
    ServerControllersModelsClientDTO,
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsCreateAdministratorRequestDto
} from '../../api/generated/api';

export type User = ServerControllersModelsUserDTO;
export type AuthUser = ServerControllersModelsAuthUserDTO;
export type Client = ServerControllersModelsClientDTO;
export type Employee = ServerControllersModelsEmployeeDTO;
export type AdminCreateData = ServerControllersModelsCreateAdministratorRequestDto;