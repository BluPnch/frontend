import React, { useState, useEffect } from 'react';
import { Layout } from '../../ui/layout/Layout';
import type { User, Client, Employee, AuthUser, AdminCreateData } from '../../core/models/user';
import type { Plant, Seed, JournalRecord, GrowthStage } from '../../core/models/product';

import {
    ClientsTab,
    EmployeesTab,
    AdministratorsTab,
    JournalTab,
    PlantsTab,
    SeedsTab,
    PlantModal,
    SeedModal,
    JournalModal,
    AdminModal
} from './components';

import { seedService } from "../../core/services/seed-service";
import { adminService } from "../../core/services/admin-service";
import { plantService } from "../../core/services/plant-service";
import { userService } from "../../core/services/user-service";
import { journalService } from "../../core/services/journal-service";
import {useNavigate} from "react-router-dom";

type TabType = 'clients' | 'employees' | 'administrators' | 'journal' | 'plants' | 'seeds';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('clients');
    const [clients, setClients] = useState<Client[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [administrators, setAdministrators] = useState<AuthUser[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [seeds, setSeeds] = useState<Seed[]>([]);
    const [journalRecords, setJournalRecords] = useState<JournalRecord[]>([]);
    const [growthStages, setGrowthStages] = useState<GrowthStage[]>([]);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });

    const [showPlantModal, setShowPlantModal] = useState(false);
    const [showSeedModal, setShowSeedModal] = useState(false);
    const [showJournalModal, setShowJournalModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
    const [editingSeed, setEditingSeed] = useState<Seed | null>(null);
    const [editingJournal, setEditingJournal] = useState<JournalRecord | null>(null);

    useEffect(() => {
        console.log('🟡 AdminDashboard: showJournalModal =', showJournalModal);
        console.log('🟡 AdminDashboard: editingJournal =', editingJournal);
        init();
    }, []);

    const showAlertMessage = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type, show: true });
        setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 5000);
    };

    const init = async () => {
        try {
            const user = await userService.getCurrentUser() as AuthUser;
            if (!user) {
                navigate('/login');
                return;
            }

            // Проверяем роль - только админ может зайти
            const role = user.role?.toString().toLowerCase() || '';

            if (!role.includes('admin') && !role.includes('админ')) {
                // Если не админ, перенаправляем на соответствующий dashboard
                let redirectPath = '/client';
                if (role.includes('employee') || role.includes('сотрудник')) {
                    redirectPath = '/employee';
                }
                navigate(redirectPath);
                return;
            }

            setCurrentUser(user);
            await loadAllData();
        } catch (error) {
            console.error('Initialization failed:', error);
            if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
                navigate('/login');
            }
        }
    };

    const loadAllData = async () => {
        try {
            const [
                clientsData,
                employeesData,
                adminsData,
                plantsData,
                seedsData,
                journalData,
                growthStagesData,
            ] = await Promise.all([
                adminService.getClients().catch(() => []),
                adminService.getEmployees().catch(() => []),
                adminService.getAllUsers().catch(() => []),
                plantService.getPlants().catch(() => []),
                seedService.getSeeds().catch(() => []),
                journalService.getJournalRecords().catch(() => []),
                journalService.getGrowthStages().catch(() => []),
            ]);

            setClients(clientsData);
            setEmployees(employeesData);
            setAdministrators(adminsData);
            setPlants(plantsData);
            setSeeds(seedsData);
            setJournalRecords(journalData);
            setGrowthStages(growthStagesData);
        } catch (error) {
            console.error('Failed to load data:', error);
            showAlertMessage('Ошибка загрузки данных', 'error');
        }
    };

    const switchTab = (tab: TabType) => {
        setActiveTab(tab);
    };

    // ИСПРАВЛЕННАЯ ФУНКЦИЯ - убран confirm
    const assignClientAsEmployee = async (clientId: string) => {
        // УБРАН confirm - теперь подтверждение делается в ClientsTab через модальное окно
        try {
            await adminService.updateUserRole(clientId, 1);
            showAlertMessage('Клиент успешно назначен сотрудником', 'success');
            await loadAllData();
        } catch (error) {
            showAlertMessage('Ошибка назначения: ' + (error as Error).message, 'error');
        }
    };

    // Функции удаления - нужно добавить состояние для отслеживания удаляемых элементов
    const deletePlant = async (id: string) => {
        // УБРАН confirm - теперь подтверждение делается в PlantsTab через модальное окно
        try {
            await plantService.deletePlant(id);
            showAlertMessage('Растение успешно удалено', 'success');
            await loadAllData();
        } catch (error) {
            showAlertMessage('Ошибка удаления: ' + (error as Error).message, 'error');
        }
    };

    const deleteSeed = async (id: string) => {
        // УБРАН confirm - теперь подтверждение делается в SeedsTab через модальное окно
        try {
            await seedService.deleteSeed(id);
            showAlertMessage('Семя успешно удалено', 'success');
            await loadAllData();
        } catch (error) {
            showAlertMessage('Ошибка удаления: ' + (error as Error).message, 'error');
        }
    };

    const deleteJournalRecord = async (id: string) => {
        // УБРАН confirm - теперь подтверждение делается в JournalTab через модальное окно
        try {
            await journalService.deleteJournalRecord(id);
            showAlertMessage('Запись журнала успешно удалена', 'success');
            await loadAllData();
        } catch (error) {
            showAlertMessage('Ошибка удаления: ' + (error as Error).message, 'error');
        }
    };

    const handlePlantSubmit = async (data: Plant) => {
        try {
            if (editingPlant && editingPlant.id) {
                await plantService.updatePlant(editingPlant.id, data);
                showAlertMessage('Растение успешно обновлено', 'success');
            } else {
                await plantService.createPlant(data);
                showAlertMessage('Растение успешно создано', 'success');
            }
            setShowPlantModal(false);
            setEditingPlant(null);
            await loadAllData();
        } catch (error) {
            showAlertMessage('Ошибка сохранения: ' + (error as Error).message, 'error');
        }
    };

    const handleSeedSubmit = async (data: Seed) => {
        // console.log('Submitting seed data:', data);

        try {
            if (editingSeed && editingSeed.id) {
                await seedService.updateSeed(editingSeed.id, data);
                showAlertMessage('Семя успешно обновлено', 'success');
            } else {
                await seedService.createSeed(data);
                showAlertMessage('Семя успешно создано', 'success');
            }
            setShowSeedModal(false);
            setEditingSeed(null);
            await loadAllData();
        } catch (error) {
            console.error('Seed submission error:', error);
            showAlertMessage('Ошибка сохранения: ' + (error as Error).message, 'error');
        }
    };

    const handleJournalSubmit = async (data: JournalRecord) => {
        try {
            console.log('📝 AdminDashboard: Получены данные из модалки:', data);

            if (editingJournal && editingJournal.id) {
                await journalService.updateJournalRecord(editingJournal.id, data);
                showAlertMessage('Запись журнала успешно обновлена', 'success');
            } else {
                const result = await journalService.createJournalRecord(data);
                console.log('✅ AdminDashboard: Запись создана, ответ сервера:', result);
                showAlertMessage('Запись журнала успешно создана', 'success');
            }

            setShowJournalModal(false);
            setEditingJournal(null);
            await loadAllData();
        } catch (error) {
            console.error('❌ AdminDashboard: Journal submit error:', error);
            showAlertMessage('Ошибка сохранения: ' + (error as Error).message, 'error');
        }
    };

    const handleAdminSubmit = async (data: AdminCreateData) => {
        try {
            await adminService.createAdministrator(data);
            showAlertMessage('Администратор успешно создан', 'success');
            setShowAdminModal(false);
            await loadAllData();
        } catch (error) {
            showAlertMessage('Ошибка создания: ' + (error as Error).message, 'error');
        }
    };

    const getClientName = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        return client ? (client.companyName || client.id?.substring(0, 8) + '...') : '-';
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
        <Layout title="Панель администратора">
            <div className="container">
                {alert.show && (
                    <div className={`alert alert-${alert.type}`}>
                        {alert.message}
                    </div>
                )}

                <div className="nav">
                    <div className="nav-content">
                        <div className="nav-tabs">
                            {(['clients', 'employees', 'administrators', 'journal', 'plants', 'seeds'] as TabType[]).map(tab => (
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
                    {activeTab === 'clients' && (
                        <ClientsTab
                            clients={clients}
                            onAssignAsEmployee={assignClientAsEmployee} // Теперь эта функция не имеет confirm
                        />
                    )}
                    {activeTab === 'employees' && (
                        <EmployeesTab
                            employees={employees}
                        />
                    )}
                    {activeTab === 'administrators' && (
                        <AdministratorsTab
                            administrators={administrators}
                            onAddAdmin={() => setShowAdminModal(true)}
                        />
                    )}
                    {activeTab === 'journal' && (
                        <JournalTab
                            records={journalRecords}
                            plants={plants}
                            employees={employees}
                            growthStages={growthStages}
                            clients={clients}
                            onAddRecord={() => {
                                console.log('🟢 AdminDashboard: onAddRecord вызван');
                                console.log('🟢 AdminDashboard: Устанавливаю editingJournal = null, showJournalModal = true');
                                setEditingJournal(null);
                                setShowJournalModal(true);
                            }}
                            onEditRecord={(record) => {
                                console.log('🟢 AdminDashboard: onEditRecord вызван', record);
                                setEditingJournal(record);
                                setShowJournalModal(true);
                            }}
                            onDeleteRecord={deleteJournalRecord} // Теперь эта функция не имеет confirm
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
                            onDeletePlant={deletePlant} // Теперь эта функция не имеет confirm
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
                            onDeleteSeed={deleteSeed} // Теперь эта функция не имеет confirm
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
                        onDelete={deletePlant} // Добавляем onDelete если PlantModal имеет кнопку удаления
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
                            console.log('🔴 AdminDashboard: JournalModal onClose вызван');
                            setShowJournalModal(false);
                            setEditingJournal(null);
                        }}
                        onSubmit={(data) => {
                            console.log('🟢 AdminDashboard: JournalModal onSubmit вызван с данными:', data);
                            handleJournalSubmit(data);
                        }}
                    />
                )}

                {showAdminModal && (
                    <AdminModal
                        onClose={() => setShowAdminModal(false)}
                        onSubmit={handleAdminSubmit}
                    />
                )}
            </div>
        </Layout>
    );
};

const getTabName = (tab: TabType): string => {
    const names = {
        clients: 'Клиенты',
        employees: 'Сотрудники',
        administrators: 'Администраторы',
        journal: 'Журнал',
        plants: 'Растения',
        seeds: 'Семена'
    };
    return names[tab];
};

export default AdminDashboard;