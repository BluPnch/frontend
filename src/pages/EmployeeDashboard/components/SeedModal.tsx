import React, { useState, useEffect } from 'react';
import type { Seed, Plant } from '../../../core/models/product';
import { viabilityTypes, lightRequirements, maturityOptions, waterRequirementsOptions } from '../../../core/utils/enumMaps';
import { ErrorModal } from "../../AdminDashboard/components/ErrorModal.tsx"; // Добавьте импорт

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

    const [errorModal, setErrorModal] = useState({ // Добавьте state для ошибки
        show: false,
        message: ''
    });

    useEffect(() => {
        if (seed) {
            setFormData(seed);
        } else {
            setFormData({
                plantId: '',
                maturity: '',
                viability: 0,
                lightRequirements: 0,
                waterRequirements: '',
                temperatureRequirements: 0
            });
        }
    }, [seed, show]);

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

        if (!formData.plantId) {
            showError('Выберите растение');
            return;
        }
        if (!formData.maturity) {
            showError('Выберите зрелость');
            return;
        }
        if (formData.viability == null) {
            showError('Укажите жизнеспособность');
            return;
        }
        if (formData.lightRequirements == null) {
            showError('Укажите требования к свету');
            return;
        }
        if (!formData.waterRequirements) {
            showError('Выберите требования к воде');
            return;
        }
        if (formData.temperatureRequirements == null) {
            showError('Укажите температурные требования');
            return;
        }

        onSubmit(formData as Seed);
    };

    const handleChange = (field: keyof Seed, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className={`modal ${show ? 'show' : ''}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>{seed ? 'Редактировать семя' : 'Добавить семя'}</h3>
                        <button className="close" onClick={onClose}>×</button>
                    </div>

                    <form onSubmit={handleSubmit} className="form" noValidate>
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
                            <label>Зрелость *</label>
                            <select
                                value={formData.maturity || ''}
                                onChange={(e) => handleChange('maturity', e.target.value)}
                                className={!formData.maturity ? 'invalid' : ''}
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
                                className={formData.viability == null ? 'invalid' : ''}
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
                                className={formData.lightRequirements == null ? 'invalid' : ''}
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
                                className={!formData.waterRequirements ? 'invalid' : ''}
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
                                className={formData.temperatureRequirements == null ? 'invalid' : ''}
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

            <ErrorModal
                show={errorModal.show}
                message={errorModal.message}
                onClose={closeErrorModal}
            />
        </>
    );
};