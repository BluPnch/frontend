import React from 'react';
import type { JournalRecord, Plant, GrowthStage } from '../../../core/models/product';
import type { Employee, Client } from '../../../core/models/user';
import { conditionTypes } from '../../../core/utils/enumMaps';

interface JournalTabProps {
    records: JournalRecord[];
    plants: Plant[];
    employees: Employee[];
    growthStages: GrowthStage[];
    clients: Client[];
    getClientName: (clientId: string) => string;
    getPlantInfo: (plantId: string) => string;
    getEmployeeName: (employeeId: string) => string;
    getGrowthStageName: (growthStageId: string) => string;
}

export const JournalTab: React.FC<JournalTabProps> = ({
                                                          records,
                                                          plants,
                                                          employees,
                                                          growthStages,
                                                          clients,
                                                          getClientName,
                                                          getPlantInfo,
                                                          getEmployeeName,
                                                          getGrowthStageName
                                                      }) => {
    const getConditionName = (condition: number) => {
        return conditionTypes[condition as keyof typeof conditionTypes] || 'Неизвестно';
    };

    return (
        <div className="journal-tab">
            <div className="tab-header">
                <h3>Журнал записей</h3>
            </div>

            {records.length === 0 ? (
                <div className="empty-state">
                    <p>Записи в журнале не найдены</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Растение</th>
                            <th>Стадия роста</th>
                            <th>Сотрудник</th>
                            <th>Высота (см)</th>
                            <th>Плоды</th>
                            <th>Состояние</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map(record => (
                            <tr key={record.id}>
                                <td>{new Date(record.date).toLocaleDateString('ru-RU')}</td>
                                <td>{getPlantInfo(record.plantId)}</td>
                                <td>{getGrowthStageName(record.growthStageId)}</td>
                                <td>{getEmployeeName(record.employeeId)}</td>
                                <td>{record.plantHeight}</td>
                                <td>{record.fruitCount}</td>
                                <td>{getConditionName(record.condition)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};