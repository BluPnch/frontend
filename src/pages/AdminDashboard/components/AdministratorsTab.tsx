import React from 'react';
import type { AuthUser } from '../../../core/models/user';

interface AdministratorsTabProps {
    administrators: AuthUser[];
    onAddAdmin: () => void;
}

export const AdministratorsTab: React.FC<AdministratorsTabProps> = ({ administrators, onAddAdmin }) => {
    return (
        <div className="administrators-tab">
            <div className="tab-header">
                <h2>Администраторы</h2>
                <div className="tab-actions">
                    <button className="btn btn-primary" onClick={onAddAdmin}>
                        Добавить администратора
                    </button>
                    <span className="total-count">Всего: {administrators.length}</span>
                </div>
            </div>

            {administrators.length === 0 ? (
                <div className="empty-state">
                    <p>Администраторы не найдены</p>
                    <button className="btn btn-primary" onClick={onAddAdmin}>
                        Добавить первого администратора
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Имя пользователя</th>
                            <th>ID</th>
                            <th>Роль</th>
                        </tr>
                        </thead>
                        <tbody>
                        {administrators.map(admin => (
                            <tr key={admin.id}>
                                <td>{admin.username || 'Не указано'}</td>
                                <td className="id-cell">{admin.id}</td>
                                <td>
                                        <span className="badge badge-admin">
                                            Администратор
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};