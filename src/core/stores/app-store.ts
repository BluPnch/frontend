// core/stores/app-store.ts
import { create } from 'zustand';
import { authService } from '../services/auth-service';
import { userService } from '../services/user-service';

interface AppStore {
    user: any | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    getCurrentUser: () => Promise<any>; // Добавьте эту строку
}

export const useAppStore = create<AppStore>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    login: async (username: string, password: string) => {
        try {
            const userData = await authService.login(username, password);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const currentUser = await userService.getCurrentUser();

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

    register: async (email: string, password: string) => {
        try {
            const userData = await authService.register(email, password);
            const currentUser = await userService.getCurrentUser();

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
        authService.logout();
        set({
            user: null,
            isAuthenticated: false,
            loading: false
        });
    },

    checkAuth: async () => {
        try {
            if (authService.isAuthenticated()) {
                const currentUser = await userService.getCurrentUser();
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
            const currentUser = await userService.getCurrentUser();
            set({ user: currentUser });
            return currentUser;
        } catch (error) {
            console.error('Failed to get current user in store:', error);
            throw error;
        }
    }
}));