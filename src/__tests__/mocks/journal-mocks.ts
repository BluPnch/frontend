import type { JournalRecord, GrowthStage } from '../../core/models/product';
import type {
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsGrowthStageDTO,
    ServerControllersModelsEnumsEnumCondition
} from '../../api/generated/api';

export const mockJournalRecordDTO: ServerControllersModelsJournalRecordDTO = {
    id: 'journal-1',
    plantId: 'plant-1',
    growthStageId: 'stage-1',
    employeeId: 'emp-1',
    plantHeight: 150,
    fruitCount: 10,
    condition: 5 as ServerControllersModelsEnumsEnumCondition,
    date: '2024-12-02T10:00:00Z'
};

export const mockJournalRecord: JournalRecord = {
    id: 'journal-1',
    plantId: 'plant-1',
    growthStageId: 'stage-1',
    employeeId: 'emp-1',
    plantHeight: 150,
    fruitCount: 10,
    condition: 5,
    date: '2024-12-02T10:00:00Z'
};

export const mockGrowthStageDTO: ServerControllersModelsGrowthStageDTO = {
    id: 'stage-1',
    name: 'Vegetative',
    description: 'Vegetative growth stage'
};

export const mockGrowthStage: GrowthStage = {
    id: 'stage-1',
    name: 'Vegetative',
    description: 'Vegetative growth stage'
};

export const mockJournalRecordsDTO: ServerControllersModelsJournalRecordDTO[] = [
    mockJournalRecordDTO,
    {
        id: 'journal-2',
        plantId: 'plant-2',
        growthStageId: 'stage-2',
        employeeId: 'emp-2',
        plantHeight: 200,
        fruitCount: 20,
        condition: 7 as ServerControllersModelsEnumsEnumCondition,
        date: '2024-12-03T10:00:00Z'
    }
];

export const mockGrowthStagesDTO: ServerControllersModelsGrowthStageDTO[] = [
    mockGrowthStageDTO,
    {
        id: 'stage-2',
        name: 'Flowering',
        description: 'Flowering stage'
    }
];

export const mockErrorResponse = {
    response: {
        status: 404,
        data: { message: 'Not found' }
    }
};