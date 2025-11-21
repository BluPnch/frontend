import React, { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { useAppStore } from './core/stores/app-store';
import './App.css';

function App() {
    const { checkAuth } = useAppStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <div className="App">
            <AppRouter />
        </div>
    );
}

export default App;