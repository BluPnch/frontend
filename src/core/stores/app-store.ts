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
}

export const useAppStore = create<AppStore>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    login: async (username: string, password: string) => {
        try {
            const userData = await authService.login(username, password);
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
    }
}));