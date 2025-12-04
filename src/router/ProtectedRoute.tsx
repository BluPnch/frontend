import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../core/stores/app-store';

// Вспомогательная функция для проверки роли
const hasRequiredRole = (userRole?: any, requiredRole?: string): boolean => {
    if (!requiredRole) return true; // Если роль не требуется, доступ разрешен

    if (!userRole) return false;

    const role = userRole.toString().toLowerCase();
    const required = requiredRole.toLowerCase();

    // Админ имеет доступ ко всему
    if (role.includes('admin') || role.includes('админ')) {
        return true;
    }

    // Проверка конкретной роли
    switch (required) {
        case 'admin':
            return role.includes('admin') || role.includes('админ');
        case 'employee':
            return role.includes('employee') || role.includes('сотрудник') || role.includes('emp');
        case 'client':
            return !role.includes('admin') &&
                !role.includes('админ') &&
                !role.includes('employee') &&
                !role.includes('сотрудник') &&
                !role.includes('emp');
        default:
            return true;
    }
};

// Функция для получения пути по роли
const getRolePath = (roleEnum?: any): string => {
    if (!roleEnum) return '/client';

    const role = roleEnum.toString().toLowerCase();

    if (role.includes('admin') || role.includes('админ')) {
        return '/admin';
    } else if (role.includes('employee') || role.includes('сотрудник') || role.includes('emp')) {
        return '/employee';
    } else {
        return '/client';
    }
};

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'employee' | 'client';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requiredRole
                                                              }) => {
    const { isAuthenticated, loading, user, checkAuth } = useAppStore();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (loading) {
        return (
            <div className="loading flex-center" style={{ minHeight: '50vh' }}>
                <div className="loader"></div>
                <p style={{ marginTop: '1rem' }}>Проверка доступа...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Сохраняем текущий путь для редиректа после входа
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Если пользователь пытается попасть на общий dashboard - перенаправляем на его роль
    if (location.pathname === '/dashboard' || location.pathname === '/') {
        return <Navigate to={getRolePath(user?.role)} replace />;
    }

    // Проверка роли для защищенных маршрутов
    if (!hasRequiredRole(user?.role, requiredRole)) {
        // Перенаправляем на dashboard соответствующей роли
        return <Navigate to={getRolePath(user?.role)} replace />;
    }

    return <>{children}</>;
};