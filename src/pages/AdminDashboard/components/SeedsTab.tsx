import React, { useState } from 'react';
import type { Seed, Plant } from '../../../core/models/product';
import { viabilityTypes, lightRequirements } from '../../../core/utils/enumMaps';
import { ConfirmModal } from './ConfirmModal'; // Импортируем компонент модального окна

interface SeedsTabProps {
    seeds: Seed[];
    plants: Plant[];
    onAddSeed: () => void;
    onEditSeed: (seed: Seed) => void;
    onDeleteSeed: (id: string) => void;
}

export const SeedsTab: React.FC<SeedsTabProps> = ({
                                                      seeds,
                                                      plants,
                                                      onAddSeed,
                                                      onEditSeed,
                                                      onDeleteSeed
                                                  }) => {
    // Состояния для управления модальным окном
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [seedToDelete, setSeedToDelete] = useState<string | null>(null);
    const [seedToDeleteInfo, setSeedToDeleteInfo] = useState<{ plantInfo: string } | null>(null);

    const getPlantInfo = (plantId: string) => {
        const plant = plants.find(p => p.id === plantId);
        if (!plant) return '-';
        return `${plant.family || '-'} / ${plant.specie || '-'}`;
    };

    const getViabilityName = (viability: number) => {
        return viabilityTypes[viability as keyof typeof viabilityTypes] || 'Неизвестно';
    };

    const getLightRequirementsName = (light: number) => {
        return lightRequirements[light as keyof typeof lightRequirements] || 'Неизвестно';
    };

    // Обработчик клика на кнопку удаления
    const handleDeleteClick = (seedId: string, plantId: string) => {
        const plantInfo = getPlantInfo(plantId);
        setSeedToDelete(seedId);
        setSeedToDeleteInfo({
            plantInfo
        });
        setShowDeleteModal(true);
    };

    // Подтверждение удаления
    const handleConfirmDelete = () => {
        if (seedToDelete) {
            console.log('🟢 SeedsTab: Подтверждено удаление семени с ID:', seedToDelete);
            onDeleteSeed(seedToDelete);
            setShowDeleteModal(false);
            setSeedToDelete(null);
            setSeedToDeleteInfo(null);
        }
    };

    // Отмена удаления
    const handleCancelDelete = () => {
        console.log('🟡 SeedsTab: Удаление семени отменено');
        setShowDeleteModal(false);
        setSeedToDelete(null);
        setSeedToDeleteInfo(null);
    };

    return (
        <div className="seeds-tab">
            {/* Модальное окно подтверждения удаления */}
            <ConfirmModal
                show={showDeleteModal}
                title="Подтверждение удаления семени"
                message={
                    seedToDeleteInfo
                        ? `Вы уверены, что хотите удалить семя растения "${seedToDeleteInfo.plantInfo}"? Это действие нельзя отменить.`
                        : 'Вы уверены, что хотите удалить это семя? Это действие нельзя отменить.'
                }
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Удалить"
                cancelText="Отмена"
            />

            <div className="tab-header">
                <div className="tab-actions">
                    <button className="btn btn-primary" onClick={onAddSeed}>
                        Добавить семя
                    </button>
                </div>
            </div>

            {seeds.length === 0 ? (
                <div className="empty-state">
                    <p>Семена не найдены</p>
                    <button className="btn btn-primary" onClick={onAddSeed}>
                        Добавить первое семя
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Растение</th>
                            <th>Зрелость</th>
                            <th>Жизнеспособность</th>
                            <th>Требования к свету</th>
                            <th>Требования к воде</th>
                            <th>Температура (°C)</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {seeds.map(seed => (
                            <tr key={seed.id}>
                                <td>{getPlantInfo(seed.plantId)}</td>
                                <td>{seed.maturity || 'Не указано'}</td>
                                <td>{getViabilityName(seed.viability)}</td>
                                <td>{getLightRequirementsName(seed.lightRequirements)}</td>
                                <td>{seed.waterRequirements || 'Не указано'}</td>
                                <td>{seed.temperatureRequirements}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => onEditSeed(seed)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteClick(seed.id!, seed.plantId)}
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