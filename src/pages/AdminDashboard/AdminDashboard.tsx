import React from 'react';
import { Layout } from '../../ui/layout/Layout';

export const AdminDashboard: React.FC = () => {
    return (
        <Layout title="Административная панель">
            <div className="container">
                <div className="welcome-card">
                    <h2>Панель администратора</h2>
                    <p>Управление пользователями, растениями и системой</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Пользователи</h3>
                        <div className="value">24</div>
                    </div>
                    <div className="stat-card">
                        <h3>Растения</h3>
                        <div className="value">156</div>
                    </div>
                    <div className="stat-card">
                        <h3>Сотрудники</h3>
                        <div className="value">8</div>
                    </div>
                </div>

                {/* Здесь будут компоненты для управления */}
            </div>
        </Layout>
    );
};