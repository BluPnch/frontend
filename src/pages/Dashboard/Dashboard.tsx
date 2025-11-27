// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../ui/layout/Layout';
import { useAppStore } from '../../core/stores/app-store';
import { userService } from '../../core/services/user-service';

export const Dashboard: React.FC = () => {
    const { user, getCurrentUser } = useAppStore();
    const navigate = useNavigate();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initDashboard = async () => {
            try {
                setIsLoading(true);

                // Проверяем, есть ли токен
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }

                console.log('Token found, getting current user...');
                const currentUser = await getCurrentUser();

                // Redirect based on role
                if (currentUser.role === 'Administrator') {
                    navigate('/admin');
                } else if (currentUser.role === 'Employee') {
                    navigate('/employee');
                } else if (currentUser.role === 'Client') {
                    navigate('/client');
                } else {
                    setIsRedirecting(true);
                }
            } catch (error) {
                console.error('Failed to get user:', error);
                // Если ошибка авторизации, перенаправляем на логин
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        initDashboard();
    }, [getCurrentUser, navigate]);

    if (isLoading) {
        return (
            <Layout title="Greenhouse Management System">
                <div className="container">
                    <div className="welcome-card">
                        <h2>Загрузка...</h2>
                        <p>Проверка авторизации...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Greenhouse Management System">
            <div className="container">
                <div className="welcome-card">
                    <h2>Добро пожаловать!</h2>
                    <p>Определение вашей роли...</p>
                    {user && <p>Текущий пользователь: {user.username}</p>}
                </div>

                {isRedirecting && (
                    <div className="redirect-message">
                        <p>Перенаправление на соответствующий дашборд...</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};