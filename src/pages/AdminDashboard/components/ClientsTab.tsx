import React, { useState } from 'react';
import type { Client } from '../../../core/models/user';
import { ConfirmModal } from './ConfirmModal';
import { ErrorModal } from './ErrorModal'; // Импортируем компонент модального окна для ошибок

interface ClientsTabProps {
    clients: Client[];
    onAssignAsEmployee: (clientId: string) => void;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({ clients, onAssignAsEmployee }) => {
    // Состояния для управления модальным окном назначения сотрудником
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [clientToAssign, setClientToAssign] = useState<string | null>(null);
    const [clientToAssignInfo, setClientToAssignInfo] = useState<{
        companyName: string,
        phoneNumber: string,
        clientId: string
    } | null>(null);

    // Состояние для управления модальным окном ошибок
    const [errorModal, setErrorModal] = useState({
        show: false,
        message: '',
        title: 'Ошибка'
    });

    // Показать ошибку
    const showError = (message: string, title: string = 'Ошибка') => {
        setErrorModal({
            show: true,
            message,
            title
        });
    };

    // Закрыть модальное окно ошибок
    const closeErrorModal = () => {
        setErrorModal({
            show: false,
            message: '',
            title: 'Ошибка'
        });
    };

    // Обработчик клика на кнопку назначения сотрудником
    const handleAssignClick = (clientId: string, companyName: string, phoneNumber: string) => {
        try {
            // Проверяем валидность данных клиента
            if (!clientId) {
                throw new Error('ID клиента не указан');
            }

            // Проверяем, указано ли название компании
            const displayName = companyName || 'Клиент без названия компании';
            const displayPhone = phoneNumber || 'Телефон не указан';

            setClientToAssign(clientId);
            setClientToAssignInfo({
                companyName: displayName,
                phoneNumber: displayPhone,
                clientId: clientId.substring(0, 8) + '...'
            });
            setShowAssignModal(true);
        } catch (error) {
            console.error('🔴 ClientsTab: Ошибка при подготовке назначения:', error);
            showError(
                `Не удалось подготовить назначение: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
                'Ошибка назначения'
            );
        }
    };

    // Подтверждение назначения с обработкой ошибок
    const handleConfirmAssign = async () => {
        if (!clientToAssign) {
            showError('Не указан клиент для назначения');
            return;
        }

        try {
            console.log('🟢 ClientsTab: Пытаюсь назначить клиента сотрудником с ID:', clientToAssign);

            // Дополнительная проверка перед назначением
            if (!clientToAssignInfo) {
                throw new Error('Информация о клиенте не найдена');
            }

            // Проверяем, является ли клиент уже сотрудником (если нужно)
            // В будущем можно добавить проверку через API

            // Вызываем функцию назначения
            onAssignAsEmployee(clientToAssign);

            // Сбрасываем состояние
            setShowAssignModal(false);
            setClientToAssign(null);
            setClientToAssignInfo(null);

            console.log('✅ ClientsTab: Клиент успешно отправлен на назначение сотрудником');

        } catch (error) {
            console.error('🔴 ClientsTab: Ошибка при назначении сотрудником:', error);

            // Показываем пользователю понятное сообщение об ошибке
            let errorMessage = 'Не удалось назначить клиента сотрудником. ';

            if (error instanceof Error) {
                if (error.message.includes('network') || error.message.includes('Network')) {
                    errorMessage += 'Проверьте подключение к интернету и попробуйте снова.';
                } else if (error.message.includes('permission') || error.message.includes('доступ')) {
                    errorMessage += 'У вас недостаточно прав для выполнения этого действия.';
                } else if (error.message.includes('already') || error.message.includes('уже')) {
                    errorMessage += 'Возможно, этот клиент уже назначен сотрудником.';
                } else {
                    errorMessage += error.message;
                }
            } else {
                errorMessage += 'Попробуйте позже или обратитесь к администратору.';
            }

            showError(errorMessage, 'Ошибка назначения');

            // Закрываем модальное окно назначения при ошибке
            setShowAssignModal(false);
            setClientToAssign(null);
            setClientToAssignInfo(null);
        }
    };

    // Отмена назначения
    const handleCancelAssign = () => {
        console.log('🟡 ClientsTab: Назначение сотрудником отменено');
        setShowAssignModal(false);
        setClientToAssign(null);
        setClientToAssignInfo(null);
    };

    // Валидация данных клиента перед отображением
    const validateClientData = (client: Client) => {
        if (!client || !client.id) {
            console.warn('⚠️ ClientsTab: Найден некорректный объект клиента:', client);
            return false;
        }
        return true;
    };

    // Форматирование номера телефона для отображения
    const formatPhoneNumber = (phone: string) => {
        if (!phone) return 'Не указан';

        // Простое форматирование российских номеров
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9)}`;
        }
        return phone;
    };

    // Сокращение длинного ID для отображения
    const truncateId = (id: string) => {
        if (!id) return '-';
        if (id.length <= 10) return id;
        return `${id.substring(0, 8)}...`;
    };

    return (
        <div className="clients-tab">
            {/* Модальное окно подтверждения назначения сотрудником */}
            <ConfirmModal
                show={showAssignModal}
                title="Подтверждение назначения сотрудником"
                message={
                    clientToAssignInfo
                        ? `Вы уверены, что хотите назначить клиента "${clientToAssignInfo.companyName}" (тел: ${clientToAssignInfo.phoneNumber}) сотрудником?${
                            '\n\nПосле назначения клиент получит доступ к системе как сотрудник и сможет добавлять записи в журнал растений.'
                        }`
                        : 'Вы уверены, что хотите назначить этого клиента сотрудником?'
                }
                onConfirm={handleConfirmAssign}
                onCancel={handleCancelAssign}
                confirmText="Назначить сотрудником"
                cancelText="Отмена"
            />

            {/* Модальное окно ошибок */}
            <ErrorModal
                show={errorModal.show}
                message={errorModal.message}
                onClose={closeErrorModal}
            />

            <div className="tab-header">
                <h2>Клиенты</h2>
            </div>

            {clients.length === 0 ? (
                <div className="empty-state">
                    <p>Клиенты не найдены</p>
                    <p className="empty-state-description">
                        Добавьте клиентов через административную панель или API
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Компания</th>
                            <th>Телефон</th>
                            <th>ID</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clients.map(client => {
                            // Проверяем данные клиента перед отображением
                            if (!validateClientData(client)) {
                                return null; // Пропускаем некорректные записи
                            }

                            return (
                                <tr key={client.id}>
                                    <td>
                                        {client.companyName || 'Не указано'}
                                        {!client.companyName && (
                                            <span className="text-muted"> (без названия)</span>
                                        )}
                                    </td>
                                    <td>{formatPhoneNumber(client.phoneNumber || '')}</td>
                                    <td className="id-cell" title={client.id}>
                                        {truncateId(client.id!)}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleAssignClick(
                                                client.id!,
                                                client.companyName || '',
                                                client.phoneNumber || ''
                                            )}
                                            title={`Назначить "${client.companyName || 'клиента'}" сотрудником`}
                                        >
                                            Назначить сотрудником
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};