import React, { useState, useEffect } from 'react';
import type { Seed, Plant } from '../../../core/models/product';
import { viabilityTypes, lightRequirements, maturityOptions, waterRequirementsOptions } from '../../../core/utils/enumMaps';

interface SeedModalProps {
    show: boolean;
    seed?: Seed | null;
    plants: Plant[];
    onClose: () => void;
    onSubmit: (data: Seed) => void;
}

export const SeedModal: React.FC<SeedModalProps> = ({
                                                        show,
                                                        seed, 
                                                        plants, 
                                                        onClose, 
                                                        onSubmit }) => {
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
    }, [seed, show]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.plantId &&
            formData.maturity &&
            formData.viability !== undefined &&
            formData.lightRequirements !== undefined &&
            formData.waterRequirements &&
            formData.temperatureRequirements !== undefined) {

            onSubmit(formData as Seed);
        } else {
            alert('Заполните все обязательные поля');
            console.log('Missing fields:', {
                plantId: formData.plantId,
                maturity: formData.maturity,
                viability: formData.viability,
                lightRequirements: formData.lightRequirements,
                waterRequirements: formData.waterRequirements,
                temperatureRequirements: formData.temperatureRequirements
            });
        }
    };

    const handleChange = (field: keyof Seed, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className={`modal ${show ? 'show' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{seed ? 'Редактировать семя' : 'Добавить семя'}</h3>
                    <button className="close" onClick={onClose}>×</button>
                </div>

                <div style={{padding: '10px', background: '#f0f0f0', marginBottom: '10px', textAlign: 'center'}}>
                    <button
                        type="button"
                        onClick={() => {
                            console.log('🟡 TEST: Заполняю форму семени тестовыми данными');
                            setFormData({
                                plantId: plants[0]?.id || '',
                                maturity: 'Средняя',
                                viability: 3,
                                lightRequirements: 2,
                                waterRequirements: 'Умеренный полив',
                                temperatureRequirements: 25
                            });
                        }}
                        style={{
                            background: 'orange',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        🧪 ЗАПОЛНИТЬ ТЕСТОВЫМИ ДАННЫМИ
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="form">
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