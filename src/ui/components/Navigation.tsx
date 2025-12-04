import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../core/stores/app-store';

export const Navigation: React.FC = () => {
    const { user, logout } = useAppStore();

    // Определяем доступные маршруты на основе роли пользователя
    const getAvailableRoutes = () => {
        if (!user) return [];

        const routes = [];

        // Добавляем маршруты в зависимости от роли
        switch (user.role) {
            case 'admin':
                routes.push(
                    { path: '/admin', label: 'Админ-панель', icon: '👑' },
                    { path: '/employee', label: 'Сотрудники', icon: '👨‍💼' },
                    { path: '/client', label: 'Клиенты', icon: '👥' }
                );
                break;
            case 'employee':
                routes.push(
                    { path: '/employee', label: 'Рабочая панель', icon: '👨‍💼' }
                );
                break;
            case 'client':
                routes.push(
                    { path: '/client', label: 'Мои растения', icon: '🌱' }
                );
                break;
            default:
                routes.push(
                    { path: '/client', label: 'Главная', icon: '🏠' }
                );
        }

        return routes;
    };

    const routes = getAvailableRoutes();

    return (
        <div className="nav" style={{ backgroundColor: 'var(--white)' }}>
            <div className="nav-content">
                <div className="nav-tabs">
                    {routes.map((route) => (
                        <NavLink
                            key={route.path}
                            to={route.path}
                            className={({ isActive }) =>
                                `nav-tab ${isActive ? 'active' : ''}`
                            }
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)'
                            }}
                        >
                            <span>{route.icon}</span>
                            <span>{route.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};