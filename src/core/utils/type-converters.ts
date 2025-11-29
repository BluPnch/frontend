import type {
    JournalRecord,
    Plant,
    Seed,
    GrowthStage
} from '../models/product';
import type {
    ServerControllersModelsJournalRecordDTO,
    ServerControllersModelsPlantDTO,
    ServerControllersModelsSeedDTO,
    ServerControllersModelsGrowthStageDTO,
    ServerControllersModelsEnumsEnumViability,
    ServerControllersModelsEnumsEnumLight,
    ServerControllersModelsEnumsEnumReproduction,
    ServerControllersModelsEnumsEnumFlowers,
    ServerControllersModelsEnumsEnumFruit,
    ServerControllersModelsEnumsEnumCondition
} from '../../api/generated/api';

// Безопасное преобразование с проверкой типов
export const convertToJournalRecordDTO = (record: JournalRecord): ServerControllersModelsJournalRecordDTO => {
    return {
        id: record.id || undefined,
        plantId: record.plantId,
        growthStageId: record.growthStageId,
        employeeId: record.employeeId,
        plantHeight: record.plantHeight,
        fruitCount: record.fruitCount,
        condition: record.condition as unknown as ServerControllersModelsEnumsEnumCondition,
        date: record.date
    };
};

export const convertToJournalRecord = (dto: ServerControllersModelsJournalRecordDTO): JournalRecord => {
    return {
        id: dto.id || '',
        plantId: dto.plantId || '',
        growthStageId: dto.growthStageId || '',
        employeeId: dto.employeeId || '',
        plantHeight: dto.plantHeight || 0,
        fruitCount: dto.fruitCount || 0,
        condition: (dto.condition as number) || 0,
        date: dto.date || '',
        notes: ''
    };
};

export const convertToPlantDTO = (plant: Plant): ServerControllersModelsPlantDTO => {
    return {
        id: plant.id || undefined,
        clientId: plant.clientId,
        specie: plant.specie,
        family: plant.family,
        flower: plant.flower as unknown as ServerControllersModelsEnumsEnumFlowers,
        fruit: plant.fruit as unknown as ServerControllersModelsEnumsEnumFruit,
        reproduction: plant.reproduction as unknown as ServerControllersModelsEnumsEnumReproduction
    };
};

export const convertToPlant = (dto: ServerControllersModelsPlantDTO): Plant => {
    return {
        id: dto.id || '',
        clientId: dto.clientId || '',
        specie: dto.specie || '',
        family: dto.family || '',
        flower: (dto.flower as number) || 0,
        fruit: (dto.fruit as number) || 0,
        reproduction: (dto.reproduction as number) || 0
    };
};

export const convertToSeedDTO = (seed: Seed): ServerControllersModelsSeedDTO => {
    return {
        id: seed.id || undefined,
        plantId: seed.plantId,
        maturity: seed.maturity,
        viability: seed.viability as unknown as ServerControllersModelsEnumsEnumViability,
        lightRequirements: seed.lightRequirements as unknown as ServerControllersModelsEnumsEnumLight,
        waterRequirements: seed.waterRequirements,
        temperatureRequirements: seed.temperatureRequirements
    };
};

export const convertToSeed = (dto: ServerControllersModelsSeedDTO): Seed => {
    return {
        id: dto.id || '',
        plantId: dto.plantId || '',
        maturity: dto.maturity || '',
        viability: (dto.viability as number) || 0,
        lightRequirements: (dto.lightRequirements as number) || 0,
        waterRequirements: dto.waterRequirements || '',
        temperatureRequirements: dto.temperatureRequirements || 0
    };
};

export const convertToGrowthStage = (dto: ServerControllersModelsGrowthStageDTO): GrowthStage => {
    return {
        id: dto.id || '',
        name: dto.name || '',
        description: dto.description || ''
    };
};

// Безопасные преобразования массивов с проверкой типов
export const convertPlantsArray = (dtos: any[]): Plant[] => {
    if (!dtos || !Array.isArray(dtos)) return [];
    return dtos.map(dto => convertToPlant(dto as ServerControllersModelsPlantDTO));
};

export const convertSeedsArray = (dtos: any[]): Seed[] => {
    if (!dtos || !Array.isArray(dtos)) return [];
    return dtos.map(dto => convertToSeed(dto as ServerControllersModelsSeedDTO));
};

export const convertJournalRecordsArray = (dtos: any[]): JournalRecord[] => {
    if (!dtos || !Array.isArray(dtos)) return [];
    return dtos.map(dto => convertToJournalRecord(dto as ServerControllersModelsJournalRecordDTO));
};

export const convertGrowthStagesArray = (dtos: any[]): GrowthStage[] => {
    if (!dtos || !Array.isArray(dtos)) return [];
    return dtos.map(dto => convertToGrowthStage(dto as ServerControllersModelsGrowthStageDTO));
};

// Утилиты для проверки типов
export const isPlantDTO = (obj: any): obj is ServerControllersModelsPlantDTO => {
    return obj && typeof obj === 'object' && 'specie' in obj;
};

export const isSeedDTO = (obj: any): obj is ServerControllersModelsSeedDTO => {
    return obj && typeof obj === 'object' && 'plantId' in obj;
};

export const isJournalRecordDTO = (obj: any): obj is ServerControllersModelsJournalRecordDTO => {
    return obj && typeof obj === 'object' && 'plantId' in obj && 'employeeId' in obj;
};

export const isGrowthStageDTO = (obj: any): obj is ServerControllersModelsGrowthStageDTO => {
    return obj && typeof obj === 'object' && 'name' in obj;
};