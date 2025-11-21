import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../core/services/auth-service';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};