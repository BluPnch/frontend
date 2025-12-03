import type {
    ServerControllersModelsClientDTO,
    ServerControllersModelsPlantDTO,
    ServerControllersModelsSeedDTO,
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsUserDTO
} from '../../api/generated/api';

export const mockUserDTO: ServerControllersModelsUserDTO = {
    id: 'user-1',
    phoneNumber: '+1234567890',
};

export const mockClientDTO: ServerControllersModelsClientDTO = {
    id: 'client-1',
    companyName: 'Test Company',
    phoneNumber: '+0987654321',
};

export const mockPlantDTO: ServerControllersModelsPlantDTO = {
    id: 'plant-1',
    clientId: 'client-1',
    specie: 'Rosa',
    family: 'Rosaceae',
    flower: 1 as any,
    fruit: 2 as any,
    reproduction: 3 as any,
};

export const mockSeedDTO: ServerControllersModelsSeedDTO = {
    id: 'seed-1',
    plantId: 'plant-1',
    maturity: 'mature',
    viability: 1 as any,
    lightRequirements: 2 as any,
    waterRequirements: 'moderate',
    temperatureRequirements: 20,
};

export const mockJournalRecordDTO: ServerControllersModelsJournalRecordDTO = {
    id: 'journal-1',
    plantId: 'plant-1',
    growthStageId: 'stage-1',
    employeeId: 'emp-1',
    plantHeight: 150,
    fruitCount: 10,
    condition: 5,
    date: '2024-12-02T10:00:00Z',
};

export const mockClientsDTO: ServerControllersModelsClientDTO[] = [
    mockClientDTO,
    {
        id: 'client-2',
        companyName: 'Another Company',
        phoneNumber: '+1122334455',
    },
];

export const mockPlantsDTO: ServerControllersModelsPlantDTO[] = [
    mockPlantDTO,
    {
        id: 'plant-2',
        clientId: 'client-1',
        specie: 'Mentha',
        family: 'Lamiaceae',
        flower: 4 as any,
        fruit: 5 as any,
        reproduction: 6 as any,
    },
];

export const mockSeedsDTO: ServerControllersModelsSeedDTO[] = [
    mockSeedDTO,
    {
        id: 'seed-1',
        plantId: 'plant-1',
        maturity: 'mature',
        viability: 1 as any, 
        lightRequirements: 2 as any,
        waterRequirements: 'moderate',
        temperatureRequirements: 20,
    },
];

export const mockJournalRecordsDTO: ServerControllersModelsJournalRecordDTO[] = [
    mockJournalRecordDTO,
    {
        id: 'journal-2',
        plantId: 'plant-2',
        growthStageId: 'stage-2',
        employeeId: 'emp-2',
        plantHeight: 200,
        fruitCount: 20,
        condition: 7,
        date: '2024-12-03T10:00:00Z',
    },
];