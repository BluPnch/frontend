import React from 'react';
import type { Client } from '../../../core/models/user';

interface ClientsTabProps {
    clients: Client[];
    onAssignAsEmployee: (clientId: string) => void;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({ clients, onAssignAsEmployee }) => {
    return (
        <div className="clients-tab">
            <div className="tab-header">
            

                {clients.length === 0 ? (
                    <div className="empty-state">
                        <p>Клиенты не найдены</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Компания</th>
                                <th>Телефон</th>
                                <th>ID</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clients.map(client => (
                                <tr key={client.id}>
                                    <td>{client.companyName || 'Не указано'}</td>
                                    <td>{client.phoneNumber || 'Не указан'}</td>
                                    <td className="id-cell">{client.id}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => onAssignAsEmployee(client.id!)}
                                            title="Назначить сотрудником"
                                        >
                                            Назначить сотрудником
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};