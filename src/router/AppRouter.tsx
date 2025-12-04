import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { AdminDashboard } from '../pages/AdminDashboard/AdminDashboard';
import { EmployeeDashboard } from '../pages/EmployeeDashboard/EmployeeDashboard';
import { ClientDashboard } from '../pages/ClientDashboard/ClientDashboard';
import { ProtectedRoute } from './ProtectedRoute';
import { useAppStore } from '../core/stores/app-store';

// Вспомогательная функция для получения пути по роли
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

export const AppRouter: React.FC = () => {
    const { isAuthenticated, loading, user } = useAppStore();

    // Показываем загрузку только при инициализации приложения
    if (loading) {
        return (
            <div className="loading-screen flex-center" style={{ minHeight: '100vh' }}>
                <div className="loader"></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-color)' }}>
                    Загрузка приложения...
                </p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Публичные маршруты */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to={getRolePath(user?.role)} replace />
                        ) : (
                            <Login />
                        )
                    }
                />

                {/* Защищенные маршруты по ролям */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute requiredRole="employee">
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client"
                    element={
                        <ProtectedRoute>
                            <ClientDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Редиректы */}
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <Navigate to={getRolePath(user?.role)} replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to={getRolePath(user?.role)} replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Страница 404 */}
                <Route
                    path="*"
                    element={
                        <div className="container" style={{
                            padding: 'var(--spacing-xl)',
                            textAlign: 'center'
                        }}>
                            <div className="card">
                                <h2>404 - Страница не найдена</h2>
                                <p>Запрошенная страница не существует.</p>
                                <button
                                    className="btn"
                                    onClick={() => {
                                        if (isAuthenticated) {
                                            window.location.href = getRolePath(user?.role);
                                        } else {
                                            window.location.href = '/login';
                                        }
                                    }}
                                    style={{ marginTop: 'var(--spacing-lg)' }}
                                >
                                    Вернуться на главную
                                </button>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};