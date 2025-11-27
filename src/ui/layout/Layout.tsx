import React from 'react';
import { useAppStore } from '../../core/stores/app-store';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title = 'Greenhouse System' }) => {
    const { user, logout } = useAppStore();

    return (
        <div className="layout" style={{ width: '100%' }}>
            <header className="header">
                <div className="header-content" style={{ maxWidth: '100%' }}>
                    <h1>{title}</h1>
                    <div className="user-info">
                        <span>{user?.username || 'Пользователь'}</span>
                        <button className="btn-logout" onClick={logout}>
                            Выйти
                        </button>
                    </div>
                </div>
            </header>
            <main className="main-content" style={{ width: '100%', padding: 0 }}>
                {children}
            </main>
        </div>
    );
};