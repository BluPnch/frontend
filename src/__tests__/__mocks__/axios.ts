import { jest } from '@jest/globals';

const mockAxios = {
    create: jest.fn(() => mockAxios),
    interceptors: {
        request: {
            use: jest.fn(),
        },
        response: {
            use: jest.fn(),
        },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: {
        headers: {
            common: {},
        },
    },
};

export default mockAxios;