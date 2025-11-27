import React, { useState } from 'react';
import type { AdminCreateData } from '../../../core/models/user';

interface AdminModalProps {
    onClose: () => void;
    onSubmit: (data: AdminCreateData) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<AdminCreateData>({
        phoneNumber: '',
        surname: '',
        name: '',
        patronymic: '',
        username: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.username && formData.password && formData.name) {
            onSubmit(formData);
        }
    };

    const handleChange = (field: keyof AdminCreateData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>Добавить администратора</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Имя *</label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                            placeholder="Введите имя"
                        />
                    </div>

                    <div className="form-group">
                        <label>Фамилия</label>
                        <input
                            type="text"
                            value={formData.surname || ''}
                            onChange={(e) => handleChange('surname', e.target.value)}
                            placeholder="Введите фамилию"
                        />
                    </div>

                    <div className="form-group">
                        <label>Отчество</label>
                        <input
                            type="text"
                            value={formData.patronymic || ''}
                            onChange={(e) => handleChange('patronymic', e.target.value)}
                            placeholder="Введите отчество"
                        />
                    </div>

                    <div className="form-group">
                        <label>Телефон</label>
                        <input
                            type="tel"
                            value={formData.phoneNumber || ''}
                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            placeholder="Введите номер телефона"
                        />
                    </div>

                    <div className="form-group">
                        <label>Имя пользователя *</label>
                        <input
                            type="text"
                            value={formData.username || ''}
                            onChange={(e) => handleChange('username', e.target.value)}
                            required
                            placeholder="Введите имя пользователя"
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль *</label>
                        <input
                            type="password"
                            value={formData.password || ''}
                            onChange={(e) => handleChange('password', e.target.value)}
                            required
                            placeholder="Введите пароль"
                            minLength={6}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Создать администратора
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};