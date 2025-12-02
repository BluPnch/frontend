/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: [
        '<rootDir>/src/__tests__/**/*.test.ts',
        '<rootDir>/__tests__/**/*.test.ts',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.ts'],
};

export default config;