import React, { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { useAppStore } from './core/stores/app-store';
import './App.css';

import './styles/globals/common.css';
import './styles/globals/forms.css';
import './styles/globals/auth.css';
import './styles/globals/utils.css';
import './styles/globals/layout.css';
import './styles/globals/tables.css';

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