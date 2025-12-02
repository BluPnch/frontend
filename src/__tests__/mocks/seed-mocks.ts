import type { Seed } from '../../core/models/product';
import type {
    ServerControllersModelsSeedDTO,
    ServerControllersModelsEnumsEnumViability,
    ServerControllersModelsEnumsEnumLight
} from '../../api/generated/api';

// ==================== Enum Constants ====================

export const VIABILITY_ENUM = {
    LOW: 30 as ServerControllersModelsEnumsEnumViability,
    MEDIUM: 60 as ServerControllersModelsEnumsEnumViability,
    HIGH: 80 as ServerControllersModelsEnumsEnumViability,
    VERY_HIGH: 95 as ServerControllersModelsEnumsEnumViability
};

export const LIGHT_ENUM = {
    LOW: 1 as ServerControllersModelsEnumsEnumLight,
    MEDIUM: 5 as ServerControllersModelsEnumsEnumLight,
    HIGH: 8 as ServerControllersModelsEnumsEnumLight,
    VERY_HIGH: 10 as ServerControllersModelsEnumsEnumLight
};

// ==================== Seed Mocks ====================

export const mockSeedDTO: ServerControllersModelsSeedDTO = {
    id: 'seed-1',
    plantId: 'plant-1',
    maturity: 'MATURE',
    viability: VIABILITY_ENUM.VERY_HIGH,
    lightRequirements: LIGHT_ENUM.HIGH,
    waterRequirements: 'MODERATE',
    temperatureRequirements: 25,
};

export const mockSeed: Seed = {
    id: 'seed-1',
    plantId: 'plant-1',
    maturity: 'MATURE',
    viability: 95,
    lightRequirements: 8,
    waterRequirements: 'MODERATE',
    temperatureRequirements: 25,
};

export const mockSeedsDTO: ServerControllersModelsSeedDTO[] = [
    mockSeedDTO,
    {
        id: 'seed-2',
        plantId: 'plant-1',
        maturity: 'IMMATURE',
        viability: VIABILITY_ENUM.MEDIUM,
        lightRequirements: LIGHT_ENUM.MEDIUM,
        waterRequirements: 'HIGH',
        temperatureRequirements: 22,
    },
    {
        id: 'seed-3',
        plantId: 'plant-2',
        maturity: 'MATURE',
        viability: VIABILITY_ENUM.VERY_HIGH,
        lightRequirements: LIGHT_ENUM.VERY_HIGH,
        waterRequirements: 'LOW',
        temperatureRequirements: 28,
    },
    {
        id: 'seed-4',
        plantId: 'plant-3',
        maturity: 'GERMINATED',
        viability: VIABILITY_ENUM.LOW,
        lightRequirements: LIGHT_ENUM.LOW,
        waterRequirements: 'HIGH',
        temperatureRequirements: 20,
    },
];

// ==================== Test Data Builders ====================

export const createSeedDTO = (
    overrides: Partial<ServerControllersModelsSeedDTO> = {}
): ServerControllersModelsSeedDTO => ({
    id: 'seed-dto-test',
    plantId: 'plant-dto-test',
    maturity: 'MATURE',
    viability: VIABILITY_ENUM.HIGH,
    lightRequirements: LIGHT_ENUM.HIGH,
    waterRequirements: 'MODERATE',
    temperatureRequirements: 25,
    ...overrides,
});

export const createSeed = (overrides: Partial<Seed> = {}): Seed => ({
    id: 'seed-test',
    plantId: 'plant-test',
    maturity: 'MATURE',
    viability: 90,
    lightRequirements: 8,
    waterRequirements: 'MODERATE',
    temperatureRequirements: 25,
    ...overrides,
});

// ==================== Helper Functions ====================

export const toViabilityEnum = (value: number): ServerControllersModelsEnumsEnumViability => {
    return value as ServerControllersModelsEnumsEnumViability;
};

export const toLightEnum = (value: number): ServerControllersModelsEnumsEnumLight => {
    return value as ServerControllersModelsEnumsEnumLight;
};

// ==================== Filter Test Data ====================

export const mockSeedFilters = {
    byMaturity: {
        maturity: 'MATURE',
        expectedCount: 2,
    },
    byViability: {
        viability: 'HIGH',
        expectedCount: 0,
    },
    none: {
        expectedCount: 4,
    },
};

// ==================== Test Constants ====================

export const SEED_TEST_CONSTANTS = {
    TOKEN: 'test-jwt-token-seed',
    SEED_ID: 'seed-test-id',
    PLANT_ID: 'plant-test-id',
    MATURITY_VALUES: ['MATURE', 'IMMATURE', 'GERMINATED', 'DORMANT'] as const,
    WATER_REQUIREMENTS: ['LOW', 'MODERATE', 'HIGH'] as const,
};

// ==================== API Response Mocks ====================

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