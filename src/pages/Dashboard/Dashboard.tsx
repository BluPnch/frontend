import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../ui/layout/Layout';
import { useAppStore } from '../../core/stores/app-store';

export const Dashboard: React.FC = () => {
    const { user, getCurrentUser } = useAppStore();
    const navigate = useNavigate();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const initDashboard = async () => {
            try {
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
                navigate('/login');
            }
        };

        initDashboard();
    }, [getCurrentUser, navigate]);

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