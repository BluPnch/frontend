import React from 'react';
import type { Employee } from '../../../core/models/user';

interface EmployeesTabProps {
    employees: Employee[];
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({ employees }) => {
    const getFullName = (employee: Employee) => {
        const parts = [];
        if (employee.surname) parts.push(employee.surname);
        if (employee.name) parts.push(employee.name);
        if (employee.patronymic) parts.push(employee.patronymic);
        return parts.length > 0 ? parts.join(' ') : 'Не указано';
    };

    return (
        <div className="employees-tab">
            <div className="tab-header">

                {employees.length === 0 ? (
                    <div className="empty-state">
                        <p>Сотрудники не найдены</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>ФИО</th>
                                <th>Телефон</th>
                                <th>Задача</th>
                                <th>Сфера растений</th>
                                <th>ID администратора</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>{getFullName(employee)}</td>
                                    <td>{employee.phoneNumber || 'Не указан'}</td>
                                    <td>{employee.task || 'Не указана'}</td>
                                    <td>{employee.plantDomain || 'Не указана'}</td>
                                    <td className="id-cell">{employee.administratorId}</td>
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