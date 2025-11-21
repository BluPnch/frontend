import React from 'react';
import { Layout } from '../../ui/layout/Layout';

export const EmployeeDashboard: React.FC = () => {
    return (
        <Layout title="Панель сотрудника">
            <div className="container">
                <div className="welcome-card">
                    <h2>Панель сотрудника</h2>
                    <p>Управление растениями и записями журнала</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Мои растения</h3>
                        <div className="value">42</div>
                    </div>
                    <div className="stat-card">
                        <h3>Записи сегодня</h3>
                        <div className="value">7</div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};