import type { ServerControllersModelsEnumsEnumAuth } from '../../api/generated/api';

export type UserRole = 'admin' | 'employee' | 'client';

export const getRoleFromEnum = (roleEnum?: ServerControllersModelsEnumsEnumAuth): UserRole => {
    if (!roleEnum) return 'client';

    // Преобразуем enum в строку
    const roleString = roleEnum.toString().toLowerCase();

    if (roleString.includes('admin')) return 'admin';
    if (roleString.includes('employee')) return 'employee';
    return 'client';
};

export const getRolePath = (roleEnum?: ServerControllersModelsEnumsEnumAuth): string => {
    const role = getRoleFromEnum(roleEnum);
    return `/${role}`;
};

export const hasRole = (
    userRole?: ServerControllersModelsEnumsEnumAuth,
    requiredRole: UserRole = 'client'
): boolean => {
    const userRoleString = getRoleFromEnum(userRole);
    return userRoleString === requiredRole;
};