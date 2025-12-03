import React, { useState, useEffect } from 'react';
import type { Plant } from '../../../core/models/product';
import type { Client } from '../../../core/models/user';
import { flowerTypes, fruitTypes, reproductionTypes } from '../../../core/utils/enumMaps';
import { ErrorModal } from './ErrorModal';

interface PlantModalProps {
    show: boolean;
    plant?: Plant | null;
    clients: Client[];
    onClose: () => void;
    onSubmit: (data: Plant) => void;
}

export const PlantModal: React.FC<PlantModalProps> = ({
                                                          show,
                                                          plant,
                                                          clients,
                                                          onClose,
                                                          onSubmit }) => {

    const [formData, setFormData] = useState<Partial<Plant>>({
        clientId: '',
        specie: '',
        family: '',
        flower: 0,
        fruit: 0,
        reproduction: 0
    });

    const [errorModal, setErrorModal] = useState({
        show: false,
        message: ''
    });

    useEffect(() => {
        if (plant) {
            setFormData(plant);
        } else {
            setFormData({
                clientId: '',
                specie: '',
                family: '',
                flower: 0,
                fruit: 0,
                reproduction: 0
            });
        }
    }, [plant, show]);

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

        // Валидация
        if (!formData.clientId) {
            showError('Выберите клиента');
            return;
        }
        if (!formData.specie) {
            showError('Введите вид растения');
            return;
        }
        if (!formData.family) {
            showError('Введите семейство растения');
            return;
        }

        onSubmit(formData as Plant);
    };

    const handleChange = (field: keyof Plant, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className={`modal ${show ? 'show' : ''}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>{plant ? 'Редактировать растение' : 'Добавить растение'}</h3>
                        <button className="close" onClick={onClose}>×</button>
                    </div>

                    <form onSubmit={handleSubmit} className="form" noValidate>
                        <div className="form-group">
                            <label>Клиент *</label>
                            <select
                                value={formData.clientId || ''}
                                onChange={(e) => handleChange('clientId', e.target.value)}
                                className={!formData.clientId ? 'invalid' : ''}
                            >
                                <option value="">Выберите клиента</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.companyName || client.id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Вид *</label>
                            <input
                                type="text"
                                value={formData.specie || ''}
                                onChange={(e) => handleChange('specie', e.target.value)}
                                className={!formData.specie ? 'invalid' : ''}
                                placeholder="Введите вид растения"
                            />
                        </div>

                        <div className="form-group">
                            <label>Семейство *</label>
                            <input
                                type="text"
                                value={formData.family || ''}
                                onChange={(e) => handleChange('family', e.target.value)}
                                className={!formData.family ? 'invalid' : ''}
                                placeholder="Введите семейство растения"
                            />
                        </div>

                        <div className="form-group">
                            <label>Тип цветка</label>
                            <select
                                value={formData.flower || 0}
                                onChange={(e) => handleChange('flower', parseInt(e.target.value))}
                            >
                                {Object.entries(flowerTypes).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Тип плода</label>
                            <select
                                value={formData.fruit || 0}
                                onChange={(e) => handleChange('fruit', parseInt(e.target.value))}
                            >
                                {Object.entries(fruitTypes).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Способ размножения</label>
                            <select
                                value={formData.reproduction || 0}
                                onChange={(e) => handleChange('reproduction', parseInt(e.target.value))}
                            >
                                {Object.entries(reproductionTypes).map(([value, label]) => (
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
                                {plant ? 'Сохранить' : 'Создать'}
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