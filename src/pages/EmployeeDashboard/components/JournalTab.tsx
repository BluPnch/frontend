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
    onAddRecord: () => void;
    onEditRecord: (record: JournalRecord) => void;
    onDeleteRecord: (id: string) => void;
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
                                                          onAddRecord,
                                                          onEditRecord,
                                                          onDeleteRecord,
                                                          getClientName,
                                                          getPlantInfo,
                                                          getEmployeeName,
                                                          getGrowthStageName
                                                      }) => {
    const getConditionName = (condition: number) => {
        return conditionTypes[condition as keyof typeof conditionTypes] || 'Неизвестно';
    };

    const handleAddRecord = () => {
        console.log('🟢 JournalTab: Кнопка "Добавить запись" нажата');
        console.log('🟢 JournalTab: Вызываю onAddRecord');
        onAddRecord();
    };

    return (
        <div className="journal-tab">
            <div className="tab-header">
                <div className="tab-actions">
                    <button className="btn btn-primary" onClick={handleAddRecord}>
                        Добавить запись
                    </button>
                </div>
            </div>

            {records.length === 0 ? (
                <div className="empty-state">
                    <p>Записи в журнале не найдены</p>
                    <button className="btn btn-primary" onClick={onAddRecord}>
                        Добавить первую запись
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Растение</th>
                            <th>Стадия роста</th>
                            <th>Высота (см)</th>
                            <th>Плоды</th>
                            <th>Состояние</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map(record => (
                            <tr key={record.id}>
                                <td>{new Date(record.date).toLocaleDateString('ru-RU')}</td>
                                <td>{getPlantInfo(record.plantId)}</td>
                                <td>{getGrowthStageName(record.growthStageId)}</td>
                                <td>{record.plantHeight}</td>
                                <td>{record.fruitCount}</td>
                                <td>{getConditionName(record.condition)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => onEditRecord(record)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onDeleteRecord(record.id!)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
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