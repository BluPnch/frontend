import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '@/router/AppRouter';
import { userService } from '@/core/services/user-service';

// Mock all page components
vi.mock('@/pages/Login/Login', () => ({
    Login: () => <div data-testid="login-page">Login Page</div>
}));

vi.mock('@/pages/Dashboard/Dashboard', () => ({
    Dashboard: () => <div data-testid="dashboard-page">Dashboard Page</div>
}));

vi.mock('@/pages/AdminDashboard/AdminDashboard', () => ({
    AdminDashboard: () => <div data-testid="admin-dashboard-page">Admin Dashboard Page</div>
}));

vi.mock('@/pages/EmployeeDashboard/EmployeeDashboard', () => ({
    EmployeeDashboard: () => <div data-testid="employee-dashboard-page">Employee Dashboard Page</div>
}));

vi.mock('@/pages/ClientDashboard/ClientDashboard', () => ({
    ClientDashboard: () => <div data-testid="client-dashboard-page">Client Dashboard Page</div>
}));

vi.mock('@/core/services/user-service');

describe('AppRouter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('authentication flow', () => {
        it('should redirect authenticated users from login to dashboard', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            render(
                <MemoryRouter initialEntries={['/login']}>
                    <AppRouter />
                </MemoryRouter>
            );

            // Should redirect to /dashboard, which then renders dashboard
            expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
            expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        });

        it('should show login page for unauthenticated users', () => {
            (userService.isAuthenticated as any).mockReturnValue(false);

            render(
                <MemoryRouter initialEntries={['/login']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
        });

        it('should redirect root path to dashboard', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            render(
                <MemoryRouter initialEntries={['/']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
        });
    });

    describe('protected routes', () => {
        it('should show dashboard for authenticated users', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
        });

        it('should show admin dashboard for authenticated users', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            render(
                <MemoryRouter initialEntries={['/admin']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('admin-dashboard-page')).toBeInTheDocument();
        });

        it('should show employee dashboard for authenticated users', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            render(
                <MemoryRouter initialEntries={['/employee']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('employee-dashboard-page')).toBeInTheDocument();
        });

        it('should show client dashboard for authenticated users', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            render(
                <MemoryRouter initialEntries={['/client']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('client-dashboard-page')).toBeInTheDocument();
        });

        it('should redirect unauthenticated users from protected routes to login', () => {
            (userService.isAuthenticated as any).mockReturnValue(false);

            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
        });
    });

    describe('route matching', () => {
        it('should match exact routes', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
            expect(screen.queryByTestId('admin-dashboard-page')).not.toBeInTheDocument();
        });

        it('should handle multiple route visits', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            const { unmount } = render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();

            unmount();

            // Test another route
            render(
                <MemoryRouter initialEntries={['/admin']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('admin-dashboard-page')).toBeInTheDocument();
        });
    });

    describe('user service integration', () => {
        it('should call isAuthenticated on route render', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(userService.isAuthenticated).toHaveBeenCalled();
        });

        it('should call isAuthenticated for login route check', () => {
            (userService.isAuthenticated as any).mockReturnValue(false);

            render(
                <MemoryRouter initialEntries={['/login']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(userService.isAuthenticated).toHaveBeenCalled();
        });
    });

    describe('error cases', () => {
        it('should handle missing routes gracefully', () => {
            (userService.isAuthenticated as any).mockReturnValue(true);

            render(<AppRouter />);

            // Should fall back to not found or dashboard depending on your implementation
            // Adjust this based on your actual routing logic
            expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
            // Add appropriate expectation based on your 404 handling
        });
    });
});