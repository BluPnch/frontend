import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { isAuthenticated } from './api/auth';
import './App.css';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        // Проверяем, есть ли сохраненный токен
        if (isAuthenticated()) {
            setLoggedIn(true);
        }
        setCheckingAuth(false);
    }, []);

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        // Очищаем токен
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        setLoggedIn(false);
    };

    if (checkingAuth) {
        return <div>Checking authentication...</div>;
    }

    return (
        <div className="App">
            {!loggedIn ? (
                <Login onLogin={handleLogin} />
            ) : (
                <div>
                    <button onClick={handleLogout} style={{ margin: '10px' }}>
                        Logout
                    </button>
                    <Home />
                </div>
            )}
        </div>
    );
}

export default App;