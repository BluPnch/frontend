import { Configuration } from './generated';
import { authService } from '../core/services/auth-service';

export const createApiConfiguration = (): Configuration => {
    return new Configuration({
        basePath: 'http://localhost:5097',
        accessToken: authService.getToken() || undefined,
    });
};

export const updateApiConfiguration = () => {
    const config = createApiConfiguration();
    return config;
};