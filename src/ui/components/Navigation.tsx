import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../core/stores/app-store';

export const Navigation: React.FC = () => {
    const { user, logout } = useAppStore();

    // Определяем доступные маршруты на основе роли пользователя
    const getAvailableRoutes = () => {
        if (!user) return [];

        const baseRoutes = [
            { path: '/dashboard', label: 'Главная', icon: '🏠' },
        ];

        // Добавляем маршруты в зависимости от роли
        switch (user.role) {
            case 'admin':
                return [...baseRoutes,
                    { path: '/admin', label: 'Админ', icon: '👑' },
                    { path: '/employee', label: 'Сотрудники', icon: '👨‍💼' },
                    { path: '/client', label: 'Клиенты', icon: '👥' }
                ];
            case 'employee':
                return [...baseRoutes,
                    { path: '/employee', label: 'Рабочая панель', icon: '👨‍💼' }
                ];
            case 'client':
                return [...baseRoutes,
                    { path: '/client', label: 'Мои растения', icon: '🌱' }
                ];
            default:
                return baseRoutes;
        }
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