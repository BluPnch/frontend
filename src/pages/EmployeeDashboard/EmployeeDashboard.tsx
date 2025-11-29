import React, {useEffect, useState} from 'react';
import { Layout } from '../../ui/layout/Layout';
import type {Client, Employee, User} from '../../core/models/user';
import type { Plant, Seed, JournalRecord, GrowthStage } from '../../core/models/product';

import {
    JournalTab,
    PlantsTab,
    SeedsTab,
    PlantModal,
    SeedModal,
    JournalModal
} from './components';

import { seedService } from "../../core/services/seed-service";
import { plantService } from "../../core/services/plant-service";
import { journalService } from "../../core/services/journal-service";
import {userService} from "../../core/services/user-service.ts";
import {employeeService} from "../../core/services/employee-service.ts";
import {
    convertToJournalRecordDTO,
    convertToPlantDTO,
    convertToSeedDTO,
    convertPlantsArray,
    convertSeedsArray,
    convertJournalRecordsArray,
    convertGrowthStagesArray
} from '../../core/utils/type-converters';

type TabType = 'journal' | 'plants' | 'seeds';

export const EmployeeDashboard: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('journal');
    const [clients, setClients] = useState<Client[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [seeds, setSeeds] = useState<Seed[]>([]);
    const [journalRecords, setJournalRecords] = useState<JournalRecord[]>([]);
    const [growthStages, setGrowthStages] = useState<GrowthStage[]>([]);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });

    const [showPlantModal, setShowPlantModal] = useState(false);
    const [showSeedModal, setShowSeedModal] = useState(false);
    const [showJournalModal, setShowJournalModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
    const [editingSeed, setEditingSeed] = useState<Seed | null>(null);
    const [editingJournal, setEditingJournal] = useState<JournalRecord | null>(null);

    useEffect(() => {
        console.log('🟡 EmployeeDashboard: Инициализация');
        init();
    }, []);

    const showAlertMessage = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type, show: true });
        setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 5000);
    };

    const init = async () => {
        try {
            const user = await userService.getCurrentUser();
            if (!user) {
                window.location.href = '/dashboard';
                return;
            }
            setCurrentUser(user);
            await loadAllData();
        } catch (error) {
            console.error('Initialization failed:', error);
            if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
                window.location.href = '/login';
            }
        }
    };

    const loadAllData = async () => {
        try {
            console.log('🟡 EmployeeDashboard: Начало загрузки данных');

            const [
                clientsData,
                employeesData,
                plantsData,
                seedsData,
                journalData,
                growthStagesData,
            ] = await Promise.all([
                userService.getClients().catch((error) => {
                    console.error('❌ Ошибка загрузки клиентов:', error);
                    return [];
                }),
                employeeService.getEmployees().catch((error) => {
                    console.error('❌ Ошибка загрузки сотрудников:', error);
                    return [];
                }),
                employeeService.getMyPlants().catch((error) => {
                    console.error('❌ Ошибка загрузки растений:', error);
                    return [];
                }),
                seedService.getSeeds().catch((error) => {
                    console.error('❌ Ошибка загрузки семян:', error);
                    return [];
                }),
                employeeService.getJournalRecords().catch((error) => {
                    console.error('❌ Ошибка загрузки журнала:', error);
                    return [];
                }),
                employeeService.getGrowthStages().catch((error) => {
                    console.error('❌ Ошибка загрузки стадий роста:', error);
                    return [];
                }),
            ]);

            console.log('🟡 EmployeeDashboard: Данные получены:', {
                clients: clientsData?.length,
                employees: employeesData?.length,
                plants: plantsData?.length,
                seeds: seedsData?.length,
                journal: journalData?.length,
                growthStages: growthStagesData?.length
            });

            const convertedPlants = convertPlantsArray(plantsData as any[]);
            const convertedSeeds = convertSeedsArray(seedsData as any[]);
            const convertedJournalRecords = convertJournalRecordsArray(journalData as any[]);
            const convertedGrowthStages = convertGrowthStagesArray(growthStagesData as any[]);

            console.log('🟡 EmployeeDashboard: Данные преобразованы:', {
                convertedPlants: convertedPlants.length,
                convertedSeeds: convertedSeeds.length,
                convertedJournalRecords: convertedJournalRecords.length,
                convertedGrowthStages: convertedGrowthStages.length
            });

            setClients(clientsData || []);
            setEmployees(employeesData || []);
            setPlants(convertedPlants);
            setSeeds(convertedSeeds);
            setJournalRecords(convertedJournalRecords);
            setGrowthStages(convertedGrowthStages);

            console.log('✅ EmployeeDashboard: Данные загружены и установлены в состояние');
        } catch (error) {
            console.error('❌ EmployeeDashboard: Ошибка загрузки данных:', error);
            showAlertMessage('Ошибка загрузки данных', 'error');
        }
    };

    const switchTab = (tab: TabType) => {
        setActiveTab(tab);
    };

    const handlePlantSubmit = async (data: Plant) => {
        try {
            console.log('🔍 DEBUG Plant Submit Data:', data);

            if (!data.family?.trim() || !data.specie?.trim()) {
                showAlertMessage('Пожалуйста, заполните семейство и вид растения', 'error');
                return;
            }

            const plantDTO = convertToPlantDTO(data);
            console.log('🟡 EmployeeDashboard: Отправка растения:', plantDTO);

            if (editingPlant && editingPlant.id) {
                await employeeService.updatePlant(editingPlant.id, plantDTO);
                showAlertMessage('Растение успешно обновлено', 'success');
            } else {
                const result = await plantService.createPlant(plantDTO);
                console.log('✅ EmployeeDashboard: Растение создано, ID:', result.id);
                showAlertMessage('Растение успешно создано', 'success');
            }

            setShowPlantModal(false);
            setEditingPlant(null);
            await loadAllData();
            
        } catch (error) {
            console.error('❌ EmployeeDashboard: Ошибка сохранения растения:', error);
            showAlertMessage('Ошибка сохранения: ' + (error as Error).message, 'error');
        }
    };

    const deletePlant = async (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить это растение?')) return;

        try {
            await plantService.deletePlant(id);
            showAlertMessage('Растение успешно удалено', 'success');
            await loadAllData();
        } catch (error) {
            console.error('❌ EmployeeDashboard: Ошибка удаления растения:', error);
            showAlertMessage('Ошибка удаления: ' + (error as Error).message, 'error');
        }
    };

    const handleSeedSubmit = async (data: Seed) => {
        try {
            const seedDTO = convertToSeedDTO(data);
            console.log('🟡 EmployeeDashboard: Отправка семени:', seedDTO);

            if (editingSeed && editingSeed.id) {
                await seedService.updateSeed(editingSeed.id, seedDTO);
                showAlertMessage('Семя успешно обновлено', 'success');
            } else {
                await seedService.createSeed(seedDTO);
                showAlertMessage('Семя успешно создано', 'success');
            }
            setShowSeedModal(false);
            setEditingSeed(null);
            await loadAllData();
        } catch (error) {
            console.error('❌ EmployeeDashboard: Ошибка сохранения семени:', error);
            showAlertMessage('Ошибка сохранения: ' + (error as Error).message, 'error');
        }
    };

    const deleteSeed = async (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить это семя?')) return;

        try {
            await seedService.deleteSeed(id);
            showAlertMessage('Семя успешно удалено', 'success');
            await loadAllData();
        } catch (error) {
            console.error('❌ EmployeeDashboard: Ошибка удаления семени:', error);
            showAlertMessage('Ошибка удаления: ' + (error as Error).message, 'error');
        }
    };

    const handleJournalSubmit = async (data: JournalRecord) => {
        try {
            console.log('📝 EmployeeDashboard: Получены данные из модалки:', data);

            if (!data.plantId || !data.growthStageId || !data.employeeId) {
                showAlertMessage('Пожалуйста, заполните все обязательные поля: растение, стадия роста, сотрудник', 'error');
                return;
            }

            if (data.plantHeight === undefined || data.plantHeight < 0) {
                showAlertMessage('Высота растения должна быть положительным числом', 'error');
                return;
            }

            if (data.fruitCount === undefined || data.fruitCount < 0) {
                showAlertMessage('Количество плодов должно быть положительным числом', 'error');
                return;
            }

            const journalDTO = convertToJournalRecordDTO(data);
            console.log('📝 EmployeeDashboard: Преобразованные данные:', journalDTO);

            if (editingJournal && editingJournal.id) {
                await employeeService.updateJournalRecord(editingJournal.id, journalDTO);
                showAlertMessage('Запись журнала успешно обновлена', 'success');
            } else {
                const result = await employeeService.createJournalRecord(journalDTO);
                console.log('✅ EmployeeDashboard: Запись создана, ответ сервера:', result);
                showAlertMessage('Запись журнала успешно создана', 'success');
            }

            setShowJournalModal(false);
            setEditingJournal(null);
            await loadAllData();
        } catch (error) {
            console.error('❌ EmployeeDashboard: Journal submit error:', error);
            showAlertMessage('Ошибка сохранения: ' + (error as Error).message, 'error');
        }
    };

    const deleteJournalRecord = async (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить эту запись журнала?')) return;

        try {
            await employeeService.deleteJournalRecord(id);
            showAlertMessage('Запись журнала успешно удалена', 'success');
            await loadAllData();
        } catch (error) {
            console.error('❌ EmployeeDashboard: Ошибка удаления записи журнала:', error);
            showAlertMessage('Ошибка удаления: ' + (error as Error).message, 'error');
        }
    };

    const getClientName = (clientId: string) => {
        return 'Клиент';
    };

    const getPlantInfo = (plantId: string) => {
        const plant = plants.find(p => p.id === plantId);
        if (!plant) return '-';
        return `${plant.family || '-'} / ${plant.specie || '-'}`;
    };

    const getEmployeeName = (employeeId: string) => {
        const employee = employees.find(e => e.id === employeeId);
        if (!employee) return '-';
        const parts = [];
        if (employee.surname) parts.push(employee.surname);
        if (employee.name) parts.push(employee.name);
        if (employee.patronymic) parts.push(employee.patronymic);
        return parts.length > 0 ? parts.join(' ') : employee.id?.substring(0, 8) + '...' || '-';
    };

    const getGrowthStageName = (growthStageId: string) => {
        const stage = growthStages.find(s => s.id === growthStageId);
        return stage ? (stage.name || stage.id?.substring(0, 8) + '...') : '-';
    };

    return (
        <Layout title="Панель сотрудника">
            <div className="container">
                {alert.show && (
                    <div className={`alert alert-${alert.type}`}>
                        {alert.message}
                    </div>
                )}

                <div className="nav">
                    <div className="nav-content">
                        <div className="nav-tabs">
                            {(['journal', 'plants', 'seeds'] as TabType[]).map(tab => (
                                <button
                                    key={tab}
                                    className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => switchTab(tab)}
                                >
                                    {getTabName(tab)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="tab-content">
                    {activeTab === 'journal' && (
                        <JournalTab
                            records={journalRecords}
                            plants={plants}
                            employees={employees}
                            growthStages={growthStages}
                            clients={clients}
                            onAddRecord={() => {
                                console.log('🟢 EmployeeDashboard: onAddRecord вызван');
                                setEditingJournal(null);
                                setShowJournalModal(true);
                            }}
                            onEditRecord={(record) => {
                                console.log('🟢 EmployeeDashboard: onEditRecord вызван', record);
                                setEditingJournal(record);
                                setShowJournalModal(true);
                            }}
                            onDeleteRecord={deleteJournalRecord}
                            getClientName={getClientName}
                            getPlantInfo={getPlantInfo}
                            getEmployeeName={getEmployeeName}
                            getGrowthStageName={getGrowthStageName}
                        />
                    )}
                    {activeTab === 'plants' && (
                        <PlantsTab
                            plants={plants}
                            clients={clients}
                            onAddPlant={() => {
                                setEditingPlant(null);
                                setShowPlantModal(true);
                            }}
                            onEditPlant={(plant) => {
                                setEditingPlant(plant);
                                setShowPlantModal(true);
                            }}
                            onDeletePlant={deletePlant}
                        />
                    )}
                    {activeTab === 'seeds' && (
                        <SeedsTab
                            seeds={seeds}
                            plants={plants}
                            onAddSeed={() => {
                                setEditingSeed(null);
                                setShowSeedModal(true);
                            }}
                            onEditSeed={(seed) => {
                                setEditingSeed(seed);
                                setShowSeedModal(true);
                            }}
                            onDeleteSeed={deleteSeed}
                        />
                    )}
                </div>

                {showPlantModal && (
                    <PlantModal
                        show={showPlantModal}
                        plant={editingPlant}
                        clients={clients}
                        onClose={() => {
                            setShowPlantModal(false);
                            setEditingPlant(null);
                        }}
                        onSubmit={handlePlantSubmit}
                    />
                )}

                {showSeedModal && (
                    <SeedModal
                        show={showSeedModal}
                        seed={editingSeed}
                        plants={plants}
                        onClose={() => {
                            setShowSeedModal(false);
                            setEditingSeed(null);
                        }}
                        onSubmit={handleSeedSubmit}
                    />
                )}

                {showJournalModal && (
                    <JournalModal
                        show={showJournalModal}
                        record={editingJournal}
                        plants={plants}
                        employees={employees}
                        growthStages={growthStages}
                        onClose={() => {
                            console.log('🔴 EmployeeDashboard: JournalModal onClose вызван');
                            setShowJournalModal(false);
                            setEditingJournal(null);
                        }}
                        onSubmit={(data) => {
                            console.log('🟢 EmployeeDashboard: JournalModal onSubmit вызван с данными:', data);
                            handleJournalSubmit(data);
                        }}
                    />
                )}
            </div>
        </Layout>
    );
};

const getTabName = (tab: TabType): string => {
    const names = {
        journal: 'Журнал',
        plants: 'Растения',
        seeds: 'Семена'
    };
    return names[tab];
};

export default EmployeeDashboard;