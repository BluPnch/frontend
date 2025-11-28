import React from 'react';
import type { Plant } from '../../../core/models/product';
import type { Client } from '../../../core/models/user';
import { flowerTypes, fruitTypes, reproductionTypes } from '../../../core/utils/enumMaps';

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

    return (
        <div className="plants-tab">
            <div className="tab-header">
                <div className="tab-actions">
                    <button className="btn btn-primary" onClick={onAddPlant}>
                        Добавить растение
                    </button>
                </div>
            </div>

            {plants.length === 0 ? (
                <div className="empty-state">
                    <p>Растения не найдены</p>
                    <button className="btn btn-primary" onClick={onAddPlant}>
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
                        {plants.map(plant => (
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
                                            onClick={() => onEditPlant(plant)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onDeletePlant(plant.id!)}
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