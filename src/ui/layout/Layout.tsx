import React from 'react';
import { Navigation } from '../components/Navigation';
import { useAppStore } from '../../core/stores/app-store';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    showNavigation?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
                                                  children,
                                                  title = 'Greenhouse System',
                                                  showNavigation = true
                                              }) => {
    const { user, logout } = useAppStore();

    return (
        <div className="layout">
            <header className="header">
                <div className="header-content">
                    <h1>{title}</h1>
                    <div className="user-info">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end'
                        }}>
                            <span style={{ fontWeight: '600' }}>
                                {user?.username || 'Пользователь'}
                            </span>
                            <span style={{
                                fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.8)'
                            }}>
                                {user?.role || 'Пользователь'}
                            </span>
                        </div>
                        <button className="btn-logout" onClick={logout}>
                            Выйти
                        </button>
                    </div>
                </div>
            </header>

            {showNavigation && <Navigation />}

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};