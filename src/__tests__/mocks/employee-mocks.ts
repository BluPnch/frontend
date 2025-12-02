import type {
    ServerControllersModelsEmployeeDTO,
    ServerControllersModelsPlantDTO,
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsGrowthStageDTO,
    ServerControllersModelsUserDTO
} from '../../api/generated/api';

export const mockUserDTO: ServerControllersModelsUserDTO = {
    id: 'user-1',
    phoneNumber: '+1234567890',
};

export const mockEmployeeDTO: ServerControllersModelsEmployeeDTO = {
    id: 'emp-1',
    surname: 'Иванов',
    name: 'Иван',
    patronymic: 'Иванович',
    phoneNumber: '+1234567890',
    task: 'gardener',
    plantDomain: 'greenhouse-1',
    administratorId: 'admin-1',
};

export const mockPlantDTO: ServerControllersModelsPlantDTO = {
    id: 'plant-1',
    clientId: 'client-1',
    specie: 'Rosa',
    family: 'Rosaceae',
    flower: 1,
    fruit: 2,
    reproduction: 3,
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

export const mockGrowthStageDTO: ServerControllersModelsGrowthStageDTO = {
    id: 'stage-1',
    name: 'Vegetative',
    description: 'Vegetative growth stage',
};

export const mockEmployeesDTO: ServerControllersModelsEmployeeDTO[] = [
    mockEmployeeDTO,
    {
        id: 'emp-2',
        surname: 'Петров',
        name: 'Петр',
        patronymic: 'Петрович',
        phoneNumber: '+7987654321',
        task: 'researcher',
        plantDomain: 'lab-1',
        administratorId: 'admin-1',
    },
];

export const mockPlantsDTO: ServerControllersModelsPlantDTO[] = [
    mockPlantDTO,
    {
        id: 'plant-2',
        clientId: 'client-2',
        specie: 'Mentha',
        family: 'Lamiaceae',
        flower: 4,
        fruit: 5,
        reproduction: 6,
    },
];