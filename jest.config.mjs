/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: [
        '<rootDir>/src/__tests__/**/*.test.ts',
        '<rootDir>/__tests__/**/*.test.ts',
    ],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@test/(.*)$': '<rootDir>/src/__tests__/$1',
        '^@mocks/(.*)$': '<rootDir>/src/__tests__/mocks/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.ts'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: 'tsconfig.json',
            },
        ],
    },
    extensionsToTreatAsEsm: ['.ts'],
    collectCoverageFrom: [
        'src/core/services/*.ts',
        '!src/**/*.d.ts',
        '!src/**/*.test.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};

export default config;