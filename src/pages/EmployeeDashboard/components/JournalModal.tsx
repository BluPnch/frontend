import React, { useState, useEffect } from 'react';
import type { JournalRecord, Plant, GrowthStage } from '../../../core/models/product';
import type { Employee } from '../../../core/models/user';
import { conditionTypes } from '../../../core/utils/enumMaps';
import { ErrorModal } from "../../AdminDashboard/components/ErrorModal.tsx";

interface JournalModalProps {
    show: boolean;
    record?: JournalRecord | null;
    plants: Plant[];
    employees: Employee[];
    growthStages: GrowthStage[];
    onClose: () => void;
    onSubmit: (data: JournalRecord) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
                                                              show,
                                                              record,
                                                              plants,
                                                              employees,
                                                              growthStages,
                                                              onClose,
                                                              onSubmit
                                                          }) => {
    const [formData, setFormData] = useState<Partial<JournalRecord>>({
        plantId: '',
        growthStageId: '',
        employeeId: '',
        plantHeight: 0,
        fruitCount: 0,
        condition: 0,
        date: new Date().toISOString().split('T')[0]
    });

    const [errorModal, setErrorModal] = useState({
        show: false,
        message: ''
    });

    useEffect(() => {
        if (record) {
            const recordDate = record.date.includes('T')
                ? record.date.split('T')[0]
                : record.date;

            setFormData({
                ...record,
                date: recordDate
            });
        } else {
            setFormData({
                plantId: '',
                growthStageId: '',
                employeeId: '',
                plantHeight: 0,
                fruitCount: 0,
                condition: 0,
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [record, show]);

    const showError = (message: string) => {
        setErrorModal({
            show: true,
            message
        });
    };

    const closeErrorModal = () => {
        setErrorModal({
            show: false,
            message: ''
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // УБЕРИТЕ аттрибут required из полей формы!
        if (!formData.date) {
            showError('Выберите дату');
            return;
        }
        if (!formData.plantId) {
            showError('Выберите растение');
            return;
        }
        if (!formData.growthStageId) {
            showError('Выберите стадию роста');
            return;
        }
        if (!formData.employeeId) {
            showError('Выберите сотрудника');
            return;
        }

        const submitData: JournalRecord = {
            id: record?.id || '',
            plantId: formData.plantId,
            growthStageId: formData.growthStageId,
            employeeId: formData.employeeId,
            plantHeight: formData.plantHeight || 0,
            fruitCount: formData.fruitCount || 0,
            condition: formData.condition || 0,
            date: formData.date ? `${formData.date}T00:00:00.000Z` : new Date().toISOString()
        };

        onSubmit(submitData);
    };

    const handleChange = (field: keyof JournalRecord, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className={`modal ${show ? 'show' : ''}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{record ? 'Редактировать запись' : 'Добавить запись в журнал'}</h2>
                        <button className="close" onClick={onClose}>×</button>
                    </div>

                    {/* ВАЖНО: добавьте noValidate и УБЕРИТЕ required аттрибуты! */}
                    <form onSubmit={handleSubmit} className="form" noValidate>
                        <div className="form-group">
                            <label>Дата *</label>
                            <input
                                type="date"
                                value={formData.date || ''}
                                onChange={(e) => handleChange('date', e.target.value)}
                                className={!formData.date ? 'invalid' : ''} // Добавьте класс для стилизации
                            />
                        </div>

                        <div className="form-group">
                            <label>Растение *</label>
                            <select
                                value={formData.plantId || ''}
                                onChange={(e) => handleChange('plantId', e.target.value)}
                                className={!formData.plantId ? 'invalid' : ''}
                            >
                                <option value="">Выберите растение</option>
                                {plants.map(plant => (
                                    <option key={plant.id} value={plant.id}>
                                        {plant.family} / {plant.specie}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Стадия роста *</label>
                            <select
                                value={formData.growthStageId || ''}
                                onChange={(e) => handleChange('growthStageId', e.target.value)}
                                className={!formData.growthStageId ? 'invalid' : ''}
                            >
                                <option value="">Выберите стадию роста</option>
                                {growthStages.map(stage => (
                                    <option key={stage.id} value={stage.id}>
                                        {stage.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Сотрудник *</label>
                            <select
                                value={formData.employeeId || ''}
                                onChange={(e) => handleChange('employeeId', e.target.value)}
                                className={!formData.employeeId ? 'invalid' : ''}
                            >
                                <option value="">Выберите сотрудника</option>
                                {employees.map(employee => {
                                    const name = [employee.surname, employee.name, employee.patronymic]
                                        .filter(Boolean)
                                        .join(' ');
                                    return (
                                        <option key={employee.id} value={employee.id}>
                                            {name || employee.id}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Высота растения (см)</label>
                            <input
                                type="number"
                                value={formData.plantHeight || 0}
                                onChange={(e) => handleChange('plantHeight', parseInt(e.target.value))}
                                min="0"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Количество плодов</label>
                            <input
                                type="number"
                                value={formData.fruitCount || 0}
                                onChange={(e) => handleChange('fruitCount', parseInt(e.target.value))}
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Состояние</label>
                            <select
                                value={formData.condition || 0}
                                onChange={(e) => handleChange('condition', parseInt(e.target.value))}
                            >
                                {Object.entries(conditionTypes).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Отмена
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {record ? 'Сохранить' : 'Создать'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ErrorModal
                show={errorModal.show}
                message={errorModal.message}
                onClose={closeErrorModal}
            />
        </>
    );
};