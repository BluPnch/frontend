import React, { useState } from 'react';
import type { Plant } from '../../../core/models/product';
import type { Client } from '../../../core/models/user';
import { flowerTypes, fruitTypes, reproductionTypes } from '../../../core/utils/enumMaps';
import { ConfirmModal } from './ConfirmModal';
import { ErrorModal } from './ErrorModal'; // Импортируем компонент модального окна для ошибок

interface PlantsTabProps {
    plants: Plant[];
    clients: Client[];
    onAddPlant: () => void;
    onEditPlant: (plant: Plant) => void;
    onDeletePlant: (id: string) => void;
}

export const PlantsTab: React.FC<PlantsTabProps> = ({
                                                        plants,
                                                        clients,
                                                        onAddPlant,
                                                        onEditPlant,
                                                        onDeletePlant
                                                    }) => {
    // Состояния для управления модальным окном удаления
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [plantToDelete, setPlantToDelete] = useState<string | null>(null);
    const [plantToDeleteInfo, setPlantToDeleteInfo] = useState<{
        specie: string,
        family: string,
        hasRelatedRecords?: boolean
    } | null>(null);

    // Состояние для управления модальным окном ошибок
    const [errorModal, setErrorModal] = useState({
        show: false,
        message: '',
        title: 'Ошибка'
    });

    const getClientName = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        return client ? client.companyName || client.id!.substring(0, 8) + '...' : '-';
    };

    const getFlowerName = (flower: number) => {
        return flowerTypes[flower as keyof typeof flowerTypes] || 'Неизвестно';
    };

    const getFruitName = (fruit: number) => {
        return fruitTypes[fruit as keyof typeof fruitTypes] || 'Неизвестно';
    };

    const getReproductionName = (reproduction: number) => {
        return reproductionTypes[reproduction as keyof typeof reproductionTypes] || 'Неизвестно';
    };

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

    // Обработчик клика на кнопку удаления
    const handleDeleteClick = (plantId: string, plantSpecie: string, plantFamily: string) => {
        try {
            // Проверяем наличие связанных записей (например, семян или записей журнала)
            // Это можно расширить в зависимости от вашей структуры данных
            const hasRelatedRecords = false; // Заглушка - нужно реализовать проверку

            setPlantToDelete(plantId);
            setPlantToDeleteInfo({
                specie: plantSpecie || 'Без названия',
                family: plantFamily || 'Не указано',
                hasRelatedRecords
            });
            setShowDeleteModal(true);
        } catch (error) {
            showError(`Ошибка при подготовке к удалению: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
    };

    // Подтверждение удаления с обработкой ошибок
    const handleConfirmDelete = async () => {
        if (!plantToDelete) {
            showError('Не указано растение для удаления');
            return;
        }

        try {
            console.log('🟢 PlantsTab: Пытаюсь удалить растение с ID:', plantToDelete);

            // Дополнительная проверка перед удалением
            if (!plantToDeleteInfo) {
                throw new Error('Информация о растении не найдена');
            }

            // Показываем предупреждение о связанных записях
            if (plantToDeleteInfo.hasRelatedRecords) {
                const confirmMessage = `У этого растения есть связанные записи (семена, записи журнала). Вы уверены, что хотите продолжить? Все связанные данные будут также удалены.`;

                // Можно добавить дополнительное подтверждение здесь, если нужно
                // Пока просто логируем
                console.log('⚠️ PlantsTab: У растения есть связанные записи');
            }

            // Вызываем функцию удаления
            onDeletePlant(plantToDelete);

            // Сбрасываем состояние
            setShowDeleteModal(false);
            setPlantToDelete(null);
            setPlantToDeleteInfo(null);

            console.log('✅ PlantsTab: Растение успешно отправлено на удаление');

        } catch (error) {
            console.error('🔴 PlantsTab: Ошибка при удалении растения:', error);

            // Показываем пользователю понятное сообщение об ошибке
            let errorMessage = 'Не удалось удалить растение. ';

            if (error instanceof Error) {
                if (error.message.includes('network') || error.message.includes('Network')) {
                    errorMessage += 'Проверьте подключение к интернету и попробуйте снова.';
                } else if (error.message.includes('permission') || error.message.includes('доступ')) {
                    errorMessage += 'У вас недостаточно прав для выполнения этого действия.';
                } else if (error.message.includes('foreign key') || error.message.includes('связь')) {
                    errorMessage += 'Невозможно удалить растение, так как с ним связаны другие записи (семена, записи журнала).';
                } else {
                    errorMessage += error.message;
                }
            } else {
                errorMessage += 'Попробуйте позже или обратитесь к администратору.';
            }

            showError(errorMessage, 'Ошибка удаления');

            // Закрываем модальное окно удаления при ошибке
            setShowDeleteModal(false);
            setPlantToDelete(null);
            setPlantToDeleteInfo(null);
        }
    };

    // Отмена удаления
    const handleCancelDelete = () => {
        console.log('🟡 PlantsTab: Удаление растения отменено');
        setShowDeleteModal(false);
        setPlantToDelete(null);
        setPlantToDeleteInfo(null);
    };

    // Обработчик ошибок при редактировании
    const handleEditPlant = (plant: Plant) => {
        try {
            // Проверяем, есть ли у растения необходимые данные для редактирования
            if (!plant.id) {
                throw new Error('Растение не имеет идентификатора');
            }

            console.log('🟢 PlantsTab: Редактирование растения с ID:', plant.id);
            onEditPlant(plant);

        } catch (error) {
            console.error('🔴 PlantsTab: Ошибка при редактировании растения:', error);
            showError(
                `Не удалось открыть форму редактирования: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
                'Ошибка редактирования'
            );
        }
    };

    // Обработчик ошибок при добавлении
    const handleAddPlant = () => {
        try {
            console.log('🟢 PlantsTab: Добавление нового растения');
            onAddPlant();
        } catch (error) {
            console.error('🔴 PlantsTab: Ошибка при добавлении растения:', error);
            showError(
                `Не удалось открыть форму добавления: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
                'Ошибка добавления'
            );
        }
    };

    return (
        <div className="plants-tab">
            {/* Модальное окно подтверждения удаления */}
            <ConfirmModal
                show={showDeleteModal}
                title="Подтверждение удаления растения"
                message={
                    plantToDeleteInfo
                        ? `Вы уверены, что хотите удалить растение "${plantToDeleteInfo.specie}" (${plantToDeleteInfo.family})?${
                            plantToDeleteInfo.hasRelatedRecords
                                ? ' С этим растением связаны другие записи (семена, записи журнала). Все они будут также удалены.'
                                : ''
                        } Это действие нельзя отменить.`
                        : 'Вы уверены, что хотите удалить это растение? Это действие нельзя отменить.'
                }
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Удалить"
                cancelText="Отмена"
            />

            <ErrorModal
                show={errorModal.show}
                message={errorModal.message}
                onClose={closeErrorModal}
            />

            <div className="tab-header">
                <div className="tab-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleAddPlant}
                        title="Добавить новое растение"
                    >
                        Добавить растение
                    </button>
                </div>
            </div>

            {plants.length === 0 ? (
                <div className="empty-state">
                    <p>Растения не найдены</p>
                    <button
                        className="btn btn-primary"
                        onClick={handleAddPlant}
                        title="Добавить первое растение"
                    >
                        Добавить первое растение
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Вид</th>
                            <th>Семейство</th>
                            <th>Цветок</th>
                            <th>Плод</th>
                            <th>Размножение</th>
                            <th>Клиент</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {plants.map(plant => {
                            // Проверяем данные растения перед отображением
                            const isValidPlant = plant && plant.id;

                            if (!isValidPlant) {
                                console.warn('⚠️ PlantsTab: Найден некорректный объект растения:', plant);
                                return null; // Пропускаем некорректные записи
                            }

                            return (
                                <tr key={plant.id}>
                                    <td>{plant.specie || '-'}</td>
                                    <td>{plant.family || '-'}</td>
                                    <td>{getFlowerName(plant.flower)}</td>
                                    <td>{getFruitName(plant.fruit)}</td>
                                    <td>{getReproductionName(plant.reproduction)}</td>
                                    <td>{getClientName(plant.clientId)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEditPlant(plant)}
                                                title="Редактировать растение"
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteClick(
                                                    plant.id!,
                                                    plant.specie || 'Без названия',
                                                    plant.family || 'Не указано'
                                                )}
                                                title="Удалить растение"
                                            >
                                                Удалить
                                            </button>
                                        </div>
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