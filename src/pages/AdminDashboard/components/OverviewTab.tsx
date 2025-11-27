import React from 'react';

interface Stats {
    plantsCount: number;
    clientsCount: number;
    employeesCount: number;
    journalCount: number;
}

interface OverviewTabProps {
    stats: Stats;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats }) => {
    return (
        <div className="overview-tab">
            <div className="tab-header">
                <h2>Обзор системы</h2>
                <div className="tab-actions">
                    <span className="total-count">Статистика</span>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🌱</div>
                    <div className="stat-info">
                        <h3>Растения</h3>
                        <p className="stat-number">{stats.plantsCount}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Клиенты</h3>
                        <p className="stat-number">{stats.clientsCount}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👨‍💼</div>
                    <div className="stat-info">
                        <h3>Сотрудники</h3>
                        <p className="stat-number">{stats.employeesCount}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <h3>Записи в журнале</h3>
                        <p className="stat-number">{stats.journalCount}</p>
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h3>Последняя активность</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-time">Сегодня, 10:30</span>
                        <span className="activity-text">Добавлено новое растение</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">Вчера, 15:45</span>
                        <span className="activity-text">Зарегистрирован новый клиент</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">Вчера, 12:20</span>
                        <span className="activity-text">Добавлена запись в журнал</span>
                    </div>
                </div>
            </div>
        </div>
    );
};