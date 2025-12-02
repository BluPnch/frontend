// Общие функции для создания мок ответов API

export const mockApiResponse = <T>(data: T) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
});

export const createMockError = (message: string, status: number = 500) => {
    const error = new Error(message);
    (error as any).response = {
        status,
        statusText: status === 404 ? 'Not Found' :
            status === 400 ? 'Bad Request' :
                status === 401 ? 'Unauthorized' :
                    status === 403 ? 'Forbidden' : 'Internal Server Error',
        data: { message },
        headers: {},
    };
    return error;
};

export const mockNetworkError = () => new Error('Network Error');