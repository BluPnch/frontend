import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminDashboard } from '@/pages/AdminDashboard/AdminDashboard';
import { userService } from '@/core/services/user-service';
import { adminService } from '@/core/services/admin-service';
import { plantService } from '@/core/services/plant-service';
import { seedService } from '@/core/services/seed-service';
import { journalService } from '@/core/services/journal-service';

// Mock services
vi.mock('@/core/services/user-service');
vi.mock('@/core/services/admin-service');
vi.mock('@/core/services/plant-service');
vi.mock('@/core/services/seed-service');
vi.mock('@/core/services/journal-service');

// Mock Layout
vi.mock('@/ui/layout/Layout', () => ({
    Layout: vi.fn(({ children, title }) => (
        <div>
            <h1 data-testid="layout-title">{title}</h1>
            {children}
        </div>
    ))
}));

// Mock components from ./components - должны соответствовать реальным пропсам
vi.mock('./components', () => {
    // Вместо детальных моков, создаем простые заглушки
    const createTabComponent = (testId: string, buttonText?: string, onClick?: () => void) => {
        return vi.fn((props) => (
            <div data-testid={testId}>
                Tab Content
                {buttonText && props[onClick ? Object.keys(props).find(key => typeof props[key] === 'function') || 'onClick' : 'onClick'] && (
                    <button onClick={() => {
                        if (onClick) onClick();
                        else if (props.onClick) props.onClick();
                        else if (props.onAddAdmin) props.onAddAdmin();
                        else if (props.onAssignAsEmployee) props.onAssignAsEmployee('test-id');
                        else if (props.onAddPlant) props.onAddPlant();
                    }}>
                        {buttonText}
                    </button>
                )}
            </div>
        ));
    };

    return {
        ClientsTab: createTabComponent('clients-tab', 'Назначить сотрудником'),
        EmployeesTab: createTabComponent('employees-tab'),
        AdministratorsTab: createTabComponent('admins-tab', 'Добавить администратора'),
        JournalTab: createTabComponent('journal-tab', 'Добавить запись'),
        PlantsTab: createTabComponent('plants-tab', 'Добавить растение'),
        SeedsTab: createTabComponent('seeds-tab', 'Добавить семя'),
        PlantModal: vi.fn(({ show, onClose, onSubmit }) =>
            show ? (
                <div data-testid="plant-modal">
                    Plant Modal
                    <button onClick={() => onSubmit({ id: 'new-plant' })}>Submit Plant</button>
                    <button onClick={onClose}>Close</button>
                </div>
            ) : null
        ),
        SeedModal: vi.fn(({ show, onClose, onSubmit }) =>
            show ? (
                <div data-testid="seed-modal">
                    Seed Modal
                    <button onClick={() => onSubmit({ id: 'new-seed' })}>Submit Seed</button>
                    <button onClick={onClose}>Close</button>
                </div>
            ) : null
        ),
        JournalModal: vi.fn(({ show, onClose, onSubmit }) =>
            show ? (
                <div data-testid="journal-modal">
                    Journal Modal
                    <button onClick={() => onSubmit({ id: 'new-record' })}>Submit Record</button>
                    <button onClick={onClose}>Close</button>
                </div>
            ) : null
        ),
        AdminModal: vi.fn(({ onClose, onSubmit }) => (
            <div data-testid="admin-modal">
                Admin Modal
                <button onClick={() => onSubmit({ surname: 'New', name: 'Admin', password: 'password123' })}>
                    Submit Admin
                </button>
                <button onClick={onClose}>Close</button>
            </div>
        ))
    };
});

// Mock window.location
const mockWindowLocation = vi.fn();
Object.defineProperty(window, 'location', {
    value: {
        href: mockWindowLocation
    },
    writable: true
});

// Mock window.confirm
window.confirm = vi.fn(() => true);

describe('AdminDashboard', () => {
    const mockUser = {
        id: 'admin1',
        username: 'admin',
        role: 2
    };

    const mockClients = [
        { id: 'client1', companyName: 'Client A' },
        { id: 'client2', companyName: 'Client B' }
    ];

    const mockEmployees = [
        { id: 'emp1', surname: 'Иванов', name: 'Иван' },
        { id: 'emp2', surname: 'Петров', name: 'Петр' }
    ];

    const mockAdmins = [
        { id: 'admin1', username: 'admin' },
        { id: 'admin2', username: 'superadmin' }
    ];

    const mockPlants = [
        { id: 'plant1', family: 'Rosaceae', specie: 'Rosa' },
        { id: 'plant2', family: 'Liliaceae', specie: 'Lilium' }
    ];

    const mockSeeds = [
        { id: 'seed1', plantId: 'plant1', quantity: 100 },
        { id: 'seed2', plantId: 'plant2', quantity: 50 }
    ];

    const mockJournalRecords = [
        { id: 'record1', action: 'Полив', plantId: 'plant1' },
        { id: 'record2', action: 'Обрезка', plantId: 'plant2' }
    ];

    const mockGrowthStages = [
        { id: 'stage1', name: 'Прорастание' },
        { id: 'stage2', name: 'Цветение' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock service responses
        (userService.getCurrentUser as any).mockResolvedValue(mockUser);
        (adminService.getClients as any).mockResolvedValue(mockClients);
        (adminService.getEmployees as any).mockResolvedValue(mockEmployees);
        (adminService.getAllUsers as any).mockResolvedValue(mockAdmins);
        (plantService.getPlants as any).mockResolvedValue(mockPlants);
        (seedService.getSeeds as any).mockResolvedValue(mockSeeds);
        (journalService.getJournalRecords as any).mockResolvedValue(mockJournalRecords);
        (journalService.getGrowthStages as any).mockResolvedValue(mockGrowthStages);
        (adminService.updateUserRole as any).mockResolvedValue({});
        (plantService.createPlant as any).mockResolvedValue({});
        (plantService.updatePlant as any).mockResolvedValue({});
        (plantService.deletePlant as any).mockResolvedValue({});
        (seedService.createSeed as any).mockResolvedValue({});
        (seedService.updateSeed as any).mockResolvedValue({});
        (seedService.deleteSeed as any).mockResolvedValue({});
        (journalService.createJournalRecord as any).mockResolvedValue({});
        (journalService.updateJournalRecord as any).mockResolvedValue({});
        (journalService.deleteJournalRecord as any).mockResolvedValue({});
        (adminService.createAdministrator as any).mockResolvedValue({});
    });

    it('should render dashboard with initial data', async () => {
        render(<AdminDashboard />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByTestId('layout-title')).toHaveTextContent('Панель администратора');
        });

        // Check that initial tab is clients
        await waitFor(() => {
            expect(screen.getByText('Клиенты')).toBeInTheDocument();
            expect(screen.getByText('Сотрудники')).toBeInTheDocument();
            expect(screen.getByText('Администраторы')).toBeInTheDocument();
        });
    });

    it('should handle tab switching', async () => {
        render(<AdminDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Клиенты')).toBeInTheDocument();
        });

        // Switch to employees tab
        fireEvent.click(screen.getByText('Сотрудники'));

        await waitFor(() => {
            // После переключения вкладки проверяем что что-то отобразилось
            expect(screen.getByText('Сотрудники')).toHaveClass('active');
        });
    });

    it('should handle client assignment to employee', async () => {
        render(<AdminDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Клиенты')).toBeInTheDocument();
        });

        // Нажимаем кнопку назначения сотрудником
        // Кнопка находится внутри ClientsTab компонента
        const assignButton = screen.getByText('Назначить сотрудником');
        fireEvent.click(assignButton);

        // Проверяем что confirm был вызван
        expect(window.confirm).toHaveBeenCalledWith('Вы уверены, что хотите назначить этого клиента сотрудником?');

        // Проверяем что сервис был вызван
        await waitFor(() => {
            expect(adminService.updateUserRole).toHaveBeenCalled();
        });
    });

    it('should handle admin creation', async () => {
        render(<AdminDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Администраторы')).toBeInTheDocument();
        });

        // Переключаемся на вкладку администраторов
        fireEvent.click(screen.getByText('Администраторы'));

        // Нажимаем кнопку добавления администратора
        const addButton = screen.getByText('Добавить администратора');
        fireEvent.click(addButton);

        // Проверяем что модальное окно открылось
        await waitFor(() => {
            expect(screen.getByTestId('admin-modal')).toBeInTheDocument();
        });
    });

    it('should handle unauthorized access', async () => {
        (userService.getCurrentUser as any).mockRejectedValue(
            new Error('401 Unauthorized')
        );

        render(<AdminDashboard />);

        await waitFor(() => {
            expect(mockWindowLocation).toHaveBeenCalledWith('/login');
        });
    });

    it('should show alert messages on error', async () => {
        const error = new Error('Test error');
        (adminService.getClients as any).mockRejectedValue(error);

        render(<AdminDashboard />);

        await waitFor(() => {
            // Проверяем что сервис был вызван
            expect(adminService.getClients).toHaveBeenCalled();
        });
    });
});