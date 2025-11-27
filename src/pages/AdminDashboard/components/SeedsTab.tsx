import React from 'react';
import type { Seed, Plant } from '../../../core/models/product';
import { viabilityTypes, lightRequirements } from '../../../core/utils/enumMaps';

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


    return (
        <div className="seeds-tab">
            <div className="tab-header">
                <h2>Семена</h2>
                <div className="tab-actions">
                    <button className="btn btn-primary" onClick={onAddSeed}>
                        Добавить семя
                    </button>
                    <span className="total-count">Всего: {seeds.length}</span>
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
                                            onClick={() => onDeleteSeed(seed.id!)}
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