import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const goToLogin = (redirectPath?: string) => {
        navigate('/login', {
            state: { from: redirectPath || location.pathname }
        });
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    const goBack = () => {
        navigate(-1);
    };

    const goTo = (path: string) => {
        navigate(path);
    };

    return {
        navigate,
        location,
        goToLogin,
        goToDashboard,
        goBack,
        goTo
    };
};