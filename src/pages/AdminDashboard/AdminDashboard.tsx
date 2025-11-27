import React, { useState, useEffect } from 'react';
import { Layout } from '../../ui/layout/Layout';
import { userService } from '../../core/services/user-service';
import { adminService } from '../../core/services/admin-service';
import { plantService } from '../../core/services/plant-service';
import { seedService } from '../../core/services/seed-service';
import type { User, Client, Employee, AuthUser, AdminCreateData } from '../../core/models/user';
import type { Plant, Seed, JournalRecord, GrowthStage } from '../../core/models/product';
import {
    flowerTypes,
    fruitTypes,
    reproductionTypes,
    viabilityTypes,
    lightRequirements,
    conditionTypes,
    maturityOptions,
    waterRequirementsOptions
} from '../../core/utils/enumMaps';

// Импортируем все компоненты
import {
    OverviewTab,
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

import '../../styles/globals/common.css';
import '../../styles/globals/tables.css';
import '../../styles/globals/forms.css';
import '../../styles/globals/layout.css';

type TabType = 'overview' | 'clients' | 'employees' | 'administrators' | 'journal' | 'plants' | 'seeds';

export const AdminDashboard: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [clients, setClients] = useState<Client[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [administrators, setAdministrators] = useState<AuthUser[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [seeds, setSeeds] = useState<Seed[]>([]);
    const [journalRecords, setJournalRecords] = useState<JournalRecord[]>([]);
    const [growthStages, setGrowthStages] = useState<GrowthStage[]>([]);
    const [stats, setStats] = useState({ plantsCount: 0, clientsCount: 0, employeesCount: 0, journalCount: 0 });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });

    // Modal states
    const [showPlantModal, setShowPlantModal] = useState(false);
    const [showSeedModal, setShowSeedModal] = useState(false);
    const [showJournalModal, setShowJournalModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
    const [editingSeed, setEditingSeed] = useState<Seed | null>(null);
    const [editingJournal, setEditingJournal] = useState<JournalRecord | null>(null);

    useEffect(() => {
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
        } finally {
            setLoading(false);
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
                // journalData,
                // growthStagesData,
                // statsData
            ] = await Promise.all([
                adminService.getClients().catch(() => []),
                adminService.getEmployees().catch(() => []),
                adminService.getAdministrators().catch(() => []),
                plantService.getPlants().catch(() => []),
                seedService.getSeeds().catch(() => []),
                // PlantService.getJournalRecords().catch(() => []),
                // PlantService.getGrowthStages().catch(() => []),
                // PlantService.getStats().catch(() => ({ plantsCount: 0, clientsCount: 0, employeesCount: 0, journalCount: 0 }))
            ]);

            setClients(clientsData);
            setEmployees(employeesData);
            setAdministrators(adminsData);
            setPlants(plantsData);
            setSeeds(seedsData);
            // setJournalRecords(journalData);
            // setGrowthStages(growthStagesData);
            // setStats(statsData);

            // Временные данные для демонстрации
            setStats({
                plantsCount: plantsData.length,
                clientsCount: clientsData.length,
                employeesCount: employeesData.length,
                journalCount: 0 // journalData.length
            });
        } catch (error) {
            console.error('Failed to load data:', error);
            showAlertMessage('Ошибка загрузки данных', 'error');
        }
    };

    const switchTab = (tab: TabType) => {
        setActiveTab(tab);
    };

    // Client functions
    const assignClientAsEmployee = async (clientId: string) => {
        if (!confirm('Вы уверены, что хотите назначить этого клиента сотрудником?')) return;

        try {
            // 1 = Employee role (предполагая, что это значение соответствует EnumAuth.Employee)
            await adminService.updateUserRole(clientId, 1);
            showAlertMessage('Клиент успешно назначен сотрудником', 'success');
            await loadAllData();
        } catch (error) {
            showAlertMessage('Ошибка назначения: ' + (error as Error).message, 'error');
        }
    };

    // Plant functions
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

    const deletePlant = async (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить это растение?')) return;

        try {
            await plantService.deletePlant(id);
            showAlertMessage('Растение успешно удалено', 'success');
            await loadAllData();
        } catch (error) {
            showAlertMessage('Ошибка удаления: ' + (error as Error).message, 'error');
        }
    };

    // Seed functions
    const handleSeedSubmit = async (data: Seed) => {
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
            showAlertMessage('Ошибка удаления: ' + (error as Error).message, 'error');
        }
    };

    // Journal functions (заглушки - нужно реализовать соответствующие сервисы)
    const handleJournalSubmit = async (data: JournalRecord) => {
        showAlertMessage('Функционал журнала будет реализован позже', 'success');
        setShowJournalModal(false);
        setEditingJournal(null);
    };

    const deleteJournalRecord = async (id: string) => {
        showAlertMessage('Функционал журнала будет реализован позже', 'success');
    };

    // Admin functions
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

    // Helper functions
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

    if (loading) {
        return (
            <Layout title="Административная панель">
                <div className="container">
                    <div className="loading">Загрузка...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Административная панель">
            <div className="container">
                {alert.show && (
                    <div className={`alert alert-${alert.type}`}>
                        {alert.message}
                    </div>
                )}

                <div className="welcome-card">
                    <h2>Панель администратора</h2>
                    <p>Добро пожаловать, {currentUser?.username || 'Администратор'}</p>
                </div>

                <div className="nav-tabs">
                    {(['overview', 'clients', 'employees', 'administrators', 'journal', 'plants', 'seeds'] as TabType[]).map(tab => (
                        <button
                            key={tab}
                            className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => switchTab(tab)}
                        >
                            {getTabName(tab)}
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    {activeTab === 'overview' && <OverviewTab stats={stats} />}
                    {activeTab === 'clients' && (
                        <ClientsTab
                            clients={clients}
                            onAssignAsEmployee={assignClientAsEmployee}
                        />
                    )}
                    {activeTab === 'employees' && <EmployeesTab employees={employees} />}
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
                                setEditingJournal(null);
                                setShowJournalModal(true);
                            }}
                            onEditRecord={(record) => {
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
                        record={editingJournal}
                        plants={plants}
                        employees={employees}
                        growthStages={growthStages}
                        onClose={() => {
                            setShowJournalModal(false);
                            setEditingJournal(null);
                        }}
                        onSubmit={handleJournalSubmit}
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
        overview: 'Обзор',
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