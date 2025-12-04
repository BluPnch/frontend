import { create } from 'zustand';
import { userService } from '../services/user-service';
import type { AuthUser } from '../models/user'; // Измените импорт

interface AppStore {
    user: AuthUser | null; // Измените тип
    isAuthenticated: boolean;
    loading: boolean;

    login: (username: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    getCurrentUser: () => Promise<AuthUser | null>; // Измените тип
}

export const useAppStore = create<AppStore>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    login: async (username: string, password: string) => {
        try {
            set({ loading: true });

            const userData = await userService.login(username, password);
            console.log('Login successful, userData:', userData);

            await new Promise(resolve => setTimeout(resolve, 100));

            const currentUser = await userService.getCurrentUser() as AuthUser; // Приведение типа
            console.log('Current AuthUser retrieved:', currentUser);

            set({
                user: currentUser,
                isAuthenticated: true,
                loading: false
            });

            // РЕДИРЕКТ НА ОСНОВЕ РОЛИ
            const role = currentUser?.role?.toString() || 'client';
            console.log('👑 User role for redirect:', role);

            // Не используем window.location.href чтобы сохранить SPA навигацию
            // Вместо этого вернем роль для использования в компоненте

        } catch (error) {
            console.error('Login failed in store:', error);
            set({
                user: null,
                isAuthenticated: false,
                loading: false
            });
            throw error;
        }
    },

    // Обновите register аналогично
    register: async (email: string, password: string) => {
        try {
            const userData = await userService.register(email, password);
            const currentUser = await userService.getCurrentUser() as AuthUser;

            set({
                user: currentUser,
                isAuthenticated: true,
                loading: false
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                loading: false
            });
            throw error;
        }
    },

    logout: () => {
        userService.logout();
        set({
            user: null,
            isAuthenticated: false,
            loading: false
        });
    },

    checkAuth: async () => {
        try {
            if (userService.isAuthenticated()) {
                const currentUser = await userService.getCurrentUser() as AuthUser;
                set({
                    user: currentUser,
                    isAuthenticated: true,
                    loading: false
                });
            } else {
                set({
                    user: null,
                    isAuthenticated: false,
                    loading: false
                });
            }
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                loading: false
            });
        }
    },

    getCurrentUser: async () => {
        try {
            const currentUser = await userService.getCurrentUser() as AuthUser;
            set({ user: currentUser });
            return currentUser;
        } catch (error) {
            console.error('Failed to get current user in store:', error);
            throw error;
        }
    }
}));