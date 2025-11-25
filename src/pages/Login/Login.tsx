import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../core/services/auth-service';

import '../../styles/globals/auth.css';
import '../../styles/globals/common.css';
import '../../styles/globals/forms.css';
import '../../styles/globals/utils.css';

export const Login: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const navigate = useNavigate();

    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            // Используем authService для логина
            await authService.login(loginData.username, loginData.password);

            // После успешного логина перенаправляем на dashboard
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            showAlert(err.message || 'Ошибка входа. Проверьте ваши учетные данные.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            // Используем authService для регистрации
            await authService.register(registerData.email, registerData.password);

            showAlert('Регистрация успешна! Теперь вы можете войти.', 'success');

            // Переключаем на вкладку логина и подставляем email
            setTimeout(() => {
                setActiveTab('login');
                setLoginData(prev => ({ ...prev, username: registerData.email }));
                setRegisterData({ email: '', password: '' }); // Очищаем форму регистрации
            }, 2000);
        } catch (err: any) {
            console.error('Registration error:', err);
            showAlert(err.message || 'Ошибка регистрации. Попробуйте другой email.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>Greenhouse System</h1>
                <p>Система управления теплицей</p>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                    type="button"
                >
                    Вход
                </button>
                <button
                    className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => setActiveTab('register')}
                    type="button"
                >
                    Регистрация
                </button>
            </div>

            {activeTab === 'login' && (
                <div className="tab-content active">
                    {alert && alert.type === 'error' && (
                        <div className={`alert alert-${alert.type}`}>
                            {alert.message}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="form">
                        <div className="form-group">
                            <label htmlFor="loginUsername">Имя пользователя</label>
                            <input
                                type="text"
                                id="loginUsername"
                                value={loginData.username}
                                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="loginPassword">Пароль</label>
                            <input
                                type="password"
                                id="loginPassword"
                                value={loginData.password}
                                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'register' && (
                <div className="tab-content active">
                    {alert && (
                        <div className={`alert alert-${alert.type}`}>
                            {alert.message}
                        </div>
                    )}
                    <form onSubmit={handleRegister} className="form">
                        <div className="form-group">
                            <label htmlFor="registerEmail">Email</label>
                            <input
                                type="email"
                                id="registerEmail"
                                value={registerData.email}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="registerPassword">Пароль</label>
                            <input
                                type="password"
                                id="registerPassword"
                                value={registerData.password}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};