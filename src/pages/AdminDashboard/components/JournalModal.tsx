import React, { useState, useEffect } from 'react';
import type { JournalRecord, Plant, GrowthStage } from '../../../core/models/product';
import type { Employee } from '../../../core/models/user';
import { conditionTypes } from '../../../core/utils/enumMaps';

interface JournalModalProps {
    record?: JournalRecord | null;
    plants: Plant[];
    employees: Employee[];
    growthStages: GrowthStage[];
    onClose: () => void;
    onSubmit: (data: JournalRecord) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
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

    useEffect(() => {
        if (record) {
            setFormData({
                ...record,
                date: record.date.split('T')[0]
            });
        }
    }, [record]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.plantId && formData.employeeId && formData.growthStageId) {
            onSubmit(formData as JournalRecord);
        }
    };

    const handleChange = (field: keyof JournalRecord, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>{record ? 'Редактировать запись' : 'Добавить запись в журнал'}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Дата *</label>
                        <input
                            type="date"
                            value={formData.date || ''}
                            onChange={(e) => handleChange('date', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Растение *</label>
                        <select
                            value={formData.plantId || ''}
                            onChange={(e) => handleChange('plantId', e.target.value)}
                            required
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
                            required
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
                            required
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
    );
};