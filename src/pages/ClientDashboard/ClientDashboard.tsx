import React, { useEffect, useState } from 'react';
import { Layout } from '../../ui/layout/Layout';
import type { User } from '../../core/models/user';
import type { Plant, JournalRecord } from '../../core/models/product';
import { JournalTab, PlantsTab } from './components';
import { userService } from "../../core/services/user-service.ts";
import { clientService } from "../../core/services/client-service.ts";
import {
    convertPlantsArray,
    convertJournalRecordsArray
} from '../../core/utils/type-converters';

type TabType = 'journal' | 'plants';

export const ClientDashboard: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('journal');
    const [plants, setPlants] = useState<Plant[]>([]);
    const [journalRecords, setJournalRecords] = useState<JournalRecord[]>([]);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🟡 ClientDashboard: Инициализация');
        init();
    }, []);

    const showAlertMessage = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type, show: true });
        setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 5000);
    };

    const init = async () => {
        try {
            setLoading(true);
            const user = await userService.getCurrentUser();
            if (!user) {
                window.location.href = '/dashboard';
                return;
            }
            setCurrentUser(user);
            await loadAllData();
        } catch (error) {
            console.error('Initialization failed:', error);
            showAlertMessage('Ошибка загрузки данных', 'error');
            if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const loadAllData = async () => {
        try {
            console.log('🟡 ClientDashboard: Начало загрузки данных');

            const [
                plantsData,
                journalData,
            ] = await Promise.all([
                clientService.getMyPlants().catch((error) => {
                    console.error('❌ Ошибка загрузки растений:', error);
                    return [];
                }),
                clientService.getMyJournalRecords().catch((error) => {
                    console.error('❌ Ошибка загрузки журнала:', error);
                    return [];
                }),
            ]);

            console.log('🟡 ClientDashboard: Данные получены:', {
                plants: plantsData?.length,
                journal: journalData?.length,
            });

            const convertedPlants = convertPlantsArray(plantsData as any[]);
            const convertedJournalRecords = convertJournalRecordsArray(journalData as any[]);

            console.log('🟡 ClientDashboard: Данные преобразованы:', {
                convertedPlants: convertedPlants.length,
                convertedJournalRecords: convertedJournalRecords.length,
            });

            setPlants(convertedPlants);
            setJournalRecords(convertedJournalRecords);

            console.log('✅ ClientDashboard: Данные загружены и установлены в состояние');
        } catch (error) {
            console.error('❌ ClientDashboard: Ошибка загрузки данных:', error);
            showAlertMessage('Ошибка загрузки данных', 'error');
        }
    };

    const switchTab = (tab: TabType) => {
        setActiveTab(tab);
    };

    const getPlantInfo = (plantId: string) => {
        const plant = plants.find(p => p.id === plantId);
        if (!plant) return '-';
        return `${plant.family || '-'} / ${plant.specie || '-'}`;
    };

    const getEmployeeName = (employeeId: string) => {
        return employeeId ? `Сотрудник ${employeeId.substring(0, 8)}...` : '-';
    };

    const getGrowthStageName = (growthStageId: string) => {
        return growthStageId ? `Стадия ${growthStageId.substring(0, 8)}...` : '-';
    };

    if (loading) {
        return (
            <Layout title="Панель клиента">
                <div className="container">
                    <div className="loading">Загрузка...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Панель клиента">
            <div className="container">
                {alert.show && (
                    <div className={`alert alert-${alert.type}`}>
                        {alert.message}
                    </div>
                )}

                <div className="nav">
                    <div className="nav-content">
                        <div className="nav-tabs">
                            {(['journal', 'plants'] as TabType[]).map(tab => (
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
                            employees={[]} 
                            growthStages={[]}
                            clients={[]}
                            getClientName={() => '-'}
                            getPlantInfo={getPlantInfo}
                            getEmployeeName={getEmployeeName}
                            getGrowthStageName={getGrowthStageName}
                        />
                    )}
                    {activeTab === 'plants' && (
                        <PlantsTab
                            plants={plants}
                            clients={[]}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
};

const getTabName = (tab: TabType): string => {
    const names = {
        journal: 'Журнал',
        plants: 'Растения'
    };
    return names[tab];
};

export default ClientDashboard;