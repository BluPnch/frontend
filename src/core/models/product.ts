export interface JournalRecord {
    id: string;
    plantId: string;
    growthStageId: string;
    employeeId: string;
    plantHeight: number;
    fruitCount: number;
    condition: number;
    date: string;
    notes?: string;
}

export interface Plant {
    id: string;
    clientId: string;
    specie: string;
    family: string;
    flower: number;
    fruit: number;
    reproduction: number;
}

export interface Seed {
    id: string;
    plantId: string;
    maturity: string;
    viability: number;
    lightRequirements: number;
    waterRequirements: string;
    temperatureRequirements: number;
}

export interface GrowthStage {
    id: string;
    name: string;
    description?: string;
}