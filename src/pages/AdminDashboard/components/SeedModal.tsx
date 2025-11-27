import React, { useState, useEffect } from 'react';
import type { Seed, Plant } from '../../../core/models/product';
import { viabilityTypes, lightRequirements, maturityOptions, waterRequirementsOptions } from '../../../core/utils/enumMaps';

interface SeedModalProps {
    seed?: Seed | null;
    plants: Plant[];
    onClose: () => void;
    onSubmit: (data: Seed) => void;
}

export const SeedModal: React.FC<SeedModalProps> = ({ seed, plants, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<Seed>>({
        plantId: '',
        maturity: '',
        viability: 0,
        lightRequirements: 0,
        waterRequirements: '',
        temperatureRequirements: 0
    });

    useEffect(() => {
        if (seed) {
            setFormData(seed);
        }
    }, [seed]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.plantId && formData.maturity) {
            onSubmit(formData as Seed);
        }
    };

    const handleChange = (field: keyof Seed, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>{seed ? 'Редактировать семя' : 'Добавить семя'}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
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
                        <label>Зрелость *</label>
                        <select
                            value={formData.maturity || ''}
                            onChange={(e) => handleChange('maturity', e.target.value)}
                            required
                        >
                            <option value="">Выберите зрелость</option>
                            {Object.entries(maturityOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Жизнеспособность</label>
                        <select
                            value={formData.viability || 0}
                            onChange={(e) => handleChange('viability', parseInt(e.target.value))}
                        >
                            {Object.entries(viabilityTypes).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Требования к свету</label>
                        <select
                            value={formData.lightRequirements || 0}
                            onChange={(e) => handleChange('lightRequirements', parseInt(e.target.value))}
                        >
                            {Object.entries(lightRequirements).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Требования к воде</label>
                        <select
                            value={formData.waterRequirements || ''}
                            onChange={(e) => handleChange('waterRequirements', e.target.value)}
                        >
                            <option value="">Выберите требования к воде</option>
                            {Object.entries(waterRequirementsOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Температурные требования (°C)</label>
                        <input
                            type="number"
                            value={formData.temperatureRequirements || 0}
                            onChange={(e) => handleChange('temperatureRequirements', parseInt(e.target.value))}
                            placeholder="Введите температуру"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {seed ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};