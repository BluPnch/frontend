import type { Plant, Seed, JournalRecord, GrowthStage } from '../../core/models/product';
import type {
    ServerControllersModelsPlantDTO,
    ServerControllersModelsSeedDTO,
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsGrowthStageDTO,
    ServerControllersModelsEnumsEnumCondition
} from '../../api/generated/api';

// ==================== Plant Mocks ====================

export const mockPlantDTO: ServerControllersModelsPlantDTO = {
    id: 'plant-1',
    clientId: 'client-1',
    specie: 'Solanum lycopersicum',
    family: 'Solanaceae',
    flower: 1,
    fruit: 1,
    reproduction: 1,
};

export const mockPlant: Plant = {
    id: 'plant-1',
    clientId: 'client-1',
    specie: 'Solanum lycopersicum',
    family: 'Solanaceae',
    flower: 1,
    fruit: 1,
    reproduction: 1,
};

export const mockPlantsDTO: ServerControllersModelsPlantDTO[] = [
    mockPlantDTO,
    {
        id: 'plant-2',
        clientId: 'client-1',
        specie: 'Solanum tuberosum',
        family: 'Solanaceae',
        flower: 0,
        fruit: 0,
        reproduction: 1,
    },
    {
        id: 'plant-3',
        clientId: 'client-2',
        specie: 'Rosa',
        family: 'Rosaceae',
        flower: 1,
        fruit: 0,
        reproduction: 1,
    },
    {
        id: 'plant-4',
        clientId: 'client-3',
        specie: 'Malus domestica',
        family: 'Rosaceae',
        flower: 1,
        fruit: 1,
        reproduction: 1,
    },
];

export const mockPlants: Plant[] = [
    mockPlant,
    {
        id: 'plant-2',
        clientId: 'client-1',
        specie: 'Solanum tuberosum',
        family: 'Solanaceae',
        flower: 0,
        fruit: 0,
        reproduction: 1,
    },
    {
        id: 'plant-3',
        clientId: 'client-2',
        specie: 'Rosa',
        family: 'Rosaceae',
        flower: 1,
        fruit: 0,
        reproduction: 1,
    },
];

// ==================== Seed Mocks ====================

export const mockSeedDTO: ServerControllersModelsSeedDTO = {
    id: 'seed-1',
    plantId: 'plant-1',
    maturity: 'MATURE',
    viability: 2,
    lightRequirements: 8,
    waterRequirements: 'MODERATE',
    temperatureRequirements: 25,
};

export const mockSeed: Seed = {
    id: 'seed-1',
    plantId: 'plant-1',
    maturity: 'MATURE',
    viability: 90,
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
        viability: 2,
        lightRequirements: 6,
        waterRequirements: 'HIGH',
        temperatureRequirements: 22,
    },
    {
        id: 'seed-3',
        plantId: 'plant-2',
        maturity: 'MATURE',
        viability: 2,
        lightRequirements: 3,
        waterRequirements: 'LOW',
        temperatureRequirements: 28,
    },
];

// ==================== JournalRecord Mocks ====================

export const mockJournalRecordDTO: ServerControllersModelsJournalRecordDTO = {
    id: 'journal-1',
    plantId: 'plant-1',
    growthStageId: 'stage-1',
    employeeId: 'emp-1',
    plantHeight: 150.5,
    fruitCount: 10,
    condition: 8 as ServerControllersModelsEnumsEnumCondition,
    date: '2024-12-01T10:00:00Z',
};

export const mockJournalRecord: JournalRecord = {
    id: 'journal-1',
    plantId: 'plant-1',
    growthStageId: 'stage-1',
    employeeId: 'emp-1',
    plantHeight: 150.5,
    fruitCount: 10,
    condition: 8,
    date: '2024-12-01T10:00:00Z',
};

export const mockJournalRecordsDTO: ServerControllersModelsJournalRecordDTO[] = [
    mockJournalRecordDTO,
    {
        id: 'journal-2',
        plantId: 'plant-1',
        growthStageId: 'stage-2',
        employeeId: 'emp-2',
        plantHeight: 175.2,
        fruitCount: 15,
        condition: 9 as ServerControllersModelsEnumsEnumCondition,
        date: '2024-12-02T11:30:00Z',
    },
    {
        id: 'journal-3',
        plantId: 'plant-2',
        growthStageId: 'stage-1',
        employeeId: 'emp-1',
        plantHeight: 80.0,
        fruitCount: 0,
        condition: 6 as ServerControllersModelsEnumsEnumCondition,
        date: '2024-12-01T09:15:00Z',
    },
];

// ==================== GrowthStage Mocks ====================

export const mockGrowthStageDTO: ServerControllersModelsGrowthStageDTO = {
    id: 'stage-1',
    name: 'Seedling',
    description: 'Early growth stage, first leaves appear',
};

export const mockGrowthStage: GrowthStage = {
    id: 'stage-1',
    name: 'Seedling',
    description: 'Early growth stage, first leaves appear',
};

export const mockGrowthStagesDTO: ServerControllersModelsGrowthStageDTO[] = [
    mockGrowthStageDTO,
    {
        id: 'stage-2',
        name: 'Vegetative',
        description: 'Rapid leaf and stem growth',
    },
    {
        id: 'stage-3',
        name: 'Flowering',
        description: 'Bud formation and flowering',
    },
    {
        id: 'stage-4',
        name: 'Fruiting',
        description: 'Fruit development and maturation',
    },
];

// ==================== Test Data Builders ====================

export const createPlant = (overrides: Partial<Plant> = {}): Plant => ({
    id: 'plant-test',
    clientId: 'client-test',
    specie: 'Test Species',
    family: 'Test Family',
    flower: 1,
    fruit: 1,
    reproduction: 1,
    ...overrides,
});

export const createPlantDTO = (overrides: Partial<ServerControllersModelsPlantDTO> = {}): ServerControllersModelsPlantDTO => ({
    id: 'plant-dto-test',
    clientId: 'client-dto-test',
    specie: 'Test DTO Species',
    family: 'Test DTO Family',
    flower: 1,
    fruit: 1,
    reproduction: 1,
    ...overrides,
});

export const createJournalRecord = (overrides: Partial<JournalRecord> = {}): JournalRecord => ({
    id: 'journal-test',
    plantId: 'plant-test',
    growthStageId: 'stage-test',
    employeeId: 'emp-test',
    plantHeight: 100,
    fruitCount: 5,
    condition: 5,
    date: new Date().toISOString(),
    ...overrides,
});

// ==================== API Response Mocks ====================

export const mockApiResponse = <T>(data: T) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
});

export const mockApiError = (message: string = 'Internal Server Error', status: number = 500) => {
    const error = new Error(message);
    (error as any).response = {
        status,
        statusText: status === 404 ? 'Not Found' : 'Internal Server Error',
        data: { message },
        headers: {},
    };
    return error;
};

export const mockNetworkError = () => new Error('Network Error');

export const mockValidationError = (field: string, message: string) => {
    const error = new Error('Validation failed');
    (error as any).response = {
        status: 400,
        statusText: 'Bad Request',
        data: {
            errors: [
                {
                    field,
                    message,
                },
            ],
        },
    };
    return error;
};

// ==================== Filter Test Data ====================

export const mockPlantFilters = {
    byFamily: {
        family: 'Solanaceae',
        expectedCount: 2,
    },
    bySpecies: {
        species: 'Rosa',
        expectedCount: 1,
    },
    byBoth: {
        family: 'Rosaceae',
        species: 'Malus domestica',
        expectedCount: 1,
    },
    none: {
        expectedCount: 4,
    },
};

// ==================== Error Test Data ====================

export const mockErrorResponses = {
    notFound: mockApiError('Plant not found', 404),
    unauthorized: mockApiError('Unauthorized', 401),
    forbidden: mockApiError('Forbidden', 403),
    validation: mockValidationError('specie', 'Species is required'),
    serverError: mockApiError('Internal Server Error', 500),
    networkError: mockNetworkError(),
};

// ==================== Test Constants ====================

export const TEST_CONSTANTS = {
    TOKEN: 'test-jwt-token-1234567890',
    PLANT_ID: 'plant-test-id',
    CLIENT_ID: 'client-test-id',
    EMPLOYEE_ID: 'emp-test-id',
    GROWTH_STAGE_ID: 'stage-test-id',
    JOURNAL_ID: 'journal-test-id',
    SEED_ID: 'seed-test-id',
    DATE_FORMAT: 'YYYY-MM-DDTHH:mm:ssZ',
};

// ==================== Utility Functions ====================

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const simulateApiCall = async <T>(
    data: T,
    shouldFail: boolean = false,
    delayMs: number = 100
): Promise<{ data: T }> => {
    await delay(delayMs);

    if (shouldFail) {
        throw mockNetworkError();
    }

    return { data };
};