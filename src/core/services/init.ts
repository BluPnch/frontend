import { setTokenGetter } from '../../api/api-client';
import { authService } from './auth-service';

export const initializeApp = () => {
    setTokenGetter(() => authService.getToken());
    console.log('App services initialized');
};