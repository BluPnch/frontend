import React from 'react';
import { Layout } from '../../ui/layout/Layout';

export const ClientDashboard: React.FC = () => {
    return (
        <Layout title="Клиентская панель">
            <div className="container">
                <div className="welcome-card">
                    <h2>Клиентская панель</h2>
                    <p>Просмотр ваших растений и отчетов</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Мои растения</h3>
                        <div className="value">15</div>
                    </div>
                    <div className="stat-card">
                        <h3>Активные проекты</h3>
                        <div className="value">3</div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};