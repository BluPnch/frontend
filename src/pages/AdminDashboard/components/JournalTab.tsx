import React, { useState } from 'react';
import type { JournalRecord, Plant, GrowthStage } from '../../../core/models/product';
import type { Employee, Client } from '../../../core/models/user';
import { conditionTypes } from '../../../core/utils/enumMaps';
import { ConfirmModal } from './ConfirmModal'; // Импортируем компонент модального окна

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
    const [recordToDeleteInfo, setRecordToDeleteInfo] = useState<{ plantName: string, date: string } | null>(null);

    const getConditionName = (condition: number) => {
        return conditionTypes[condition as keyof typeof conditionTypes] || 'Неизвестно';
    };

    const handleDeleteClick = (recordId: string, plantId: string, date: string) => {
        const plantInfo = getPlantInfo(plantId);
        setRecordToDelete(recordId);
        setRecordToDeleteInfo({
            plantName: plantInfo,
            date: new Date(date).toLocaleDateString('ru-RU')
        });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (recordToDelete) {
            console.log('🟢 JournalTab: Подтверждено удаление записи с ID:', recordToDelete);
            onDeleteRecord(recordToDelete);
            setShowDeleteModal(false);
            setRecordToDelete(null);
            setRecordToDeleteInfo(null);
        }
    };

    const handleCancelDelete = () => {
        console.log('🟡 JournalTab: Удаление отменено');
        setShowDeleteModal(false);
        setRecordToDelete(null);
        setRecordToDeleteInfo(null);
    };

    const handleAddRecord = () => {
        console.log('🟢 JournalTab: Кнопка "Добавить запись" нажата');
        console.log('🟢 JournalTab: Вызываю onAddRecord');
        onAddRecord();
    };

    return (
        <div className="journal-tab">
            <ConfirmModal
                show={showDeleteModal}
                title="Подтверждение удаления записи"
                message={
                    recordToDeleteInfo
                        ? `Вы уверены, что хотите удалить запись о растении "${recordToDeleteInfo.plantName}" от ${recordToDeleteInfo.date}? Это действие нельзя отменить.`
                        : 'Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.'
                }
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Удалить"
                cancelText="Отмена"
            />

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
                            <th>Сотрудник</th>
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
                                <td>{getEmployeeName(record.employeeId)}</td>
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
                                            onClick={() => handleDeleteClick(record.id!, record.plantId, record.date)}
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