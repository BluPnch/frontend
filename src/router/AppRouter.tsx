import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { AdminDashboard } from '../pages/AdminDashboard/AdminDashboard';
import { EmployeeDashboard } from '../pages/EmployeeDashboard/EmployeeDashboard';
import { ClientDashboard } from '../pages/ClientDashboard/ClientDashboard';
import { ProtectedRoute } from './ProtectedRoute';
import { userService } from '../core/services/user-service';

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        userService.isAuthenticated() ?
                            <Navigate to="/dashboard" replace /> :
                            <Login />
                    }
                />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/employee" element={
                    <ProtectedRoute>
                        <EmployeeDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/client" element={
                    <ProtectedRoute>
                        <ClientDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};