import type {
    ServerControllersModelsPlantDTO,
    ServerControllersModelsEnumsEnumFlowers,
    ServerControllersModelsEnumsEnumFruit,
    ServerControllersModelsEnumsEnumReproduction
} from '../../api/generated/api';
import { PlantApi } from '../../api/generated/api';
import { createApiConfiguration } from '../../api/api-client';
import type { Plant } from '../models/product';

class PlantService {
    private plantApi: PlantApi;

    constructor() {
        const config = createApiConfiguration();
        this.plantApi = new PlantApi(config);
    }

    private updateApiConfig() {
        const config = createApiConfiguration();
        this.plantApi = new PlantApi(config);
    }

    async getPlants(family?: string, species?: string): Promise<Plant[]> {
        try {
            const response = await this.plantApi.apiV1PlantsGet({ family, species });
            return this.mapPlantDTOsToPlants(response.data);
        } catch (error) {
            console.error('Failed to get plants:', error);
            throw new Error('Не удалось загрузить список растений');
        }
    }

    async getPlantById(id: string): Promise<Plant> {
        try {
            const response = await this.plantApi.apiV1PlantsIdGet({ id });
            return this.mapPlantDTOToPlant(response.data);
        } catch (error) {
            console.error('Failed to get plant:', error);
            throw new Error('Не удалось загрузить информацию о растении');
        }
    }

    async createPlant(plantData: Plant): Promise<Plant> {
        try {
            const plantDTO: ServerControllersModelsPlantDTO = {
                clientId: plantData.clientId,
                specie: plantData.specie || null,
                family: plantData.family || null,
                flower: this.numberToFlowerEnum(plantData.flower),
                fruit: this.numberToFruitEnum(plantData.fruit),
                reproduction: this.numberToReproductionEnum(plantData.reproduction)
            };

            const response = await this.plantApi.apiV1PlantsPost({
                serverControllersModelsPlantDTO: plantDTO
            });
            return this.mapPlantDTOToPlant(response.data);
        } catch (error) {
            console.error('Failed to create plant:', error);
            throw new Error('Не удалось создать растение');
        }
    }

    async updatePlant(id: string, plantData: Plant): Promise<void> {
        try {
            const plantDTO: ServerControllersModelsPlantDTO = {
                id,
                clientId: plantData.clientId,
                specie: plantData.specie || null,
                family: plantData.family || null,
                flower: this.numberToFlowerEnum(plantData.flower),
                fruit: this.numberToFruitEnum(plantData.fruit),
                reproduction: this.numberToReproductionEnum(plantData.reproduction)
            };

            await this.plantApi.apiV1PlantsIdPut({
                id,
                serverControllersModelsPlantDTO: plantDTO
            });
        } catch (error) {
            console.error('Failed to update plant:', error);
            throw new Error('Не удалось обновить растение');
        }
    }

    async deletePlant(id: string): Promise<void> {
        try {
            await this.plantApi.apiV1PlantsIdDelete({ id });
        } catch (error) {
            console.error('Failed to delete plant:', error);
            throw new Error('Не удалось удалить растение');
        }
    }


    private numberToFlowerEnum(value: number): ServerControllersModelsEnumsEnumFlowers {
        const validValues = [0, 1, 2, 3, 4, 5, 6];
        if (validValues.includes(value)) {
            return value as ServerControllersModelsEnumsEnumFlowers;
        }
        return 0; 
    }

    private numberToFruitEnum(value: number): ServerControllersModelsEnumsEnumFruit {
        const validValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        if (validValues.includes(value)) {
            return value as ServerControllersModelsEnumsEnumFruit;
        }
        return 0; 
    }

    private numberToReproductionEnum(value: number): ServerControllersModelsEnumsEnumReproduction {
        const validValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        if (validValues.includes(value)) {
            return value as ServerControllersModelsEnumsEnumReproduction;
        }
        return 0; 
    }

    private flowerEnumToNumber(value: ServerControllersModelsEnumsEnumFlowers | undefined): number {
        return value !== undefined ? value : 0;
    }

    private fruitEnumToNumber(value: ServerControllersModelsEnumsEnumFruit | undefined): number {
        return value !== undefined ? value : 0;
    }

    private reproductionEnumToNumber(value: ServerControllersModelsEnumsEnumReproduction | undefined): number {
        return value !== undefined ? value : 0;
    }

    private mapPlantDTOsToPlants(plantDTOs: ServerControllersModelsPlantDTO[]): Plant[] {
        return plantDTOs.map(dto => this.mapPlantDTOToPlant(dto));
    }

    private mapPlantDTOToPlant(plantDTO: ServerControllersModelsPlantDTO): Plant {
        return {
            id: plantDTO.id || '',
            clientId: plantDTO.clientId || '',
            specie: plantDTO.specie || '',
            family: plantDTO.family || '',
            flower: this.flowerEnumToNumber(plantDTO.flower),
            fruit: this.fruitEnumToNumber(plantDTO.fruit),
            reproduction: this.reproductionEnumToNumber(plantDTO.reproduction),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    async getPlantsByClient(clientId: string): Promise<Plant[]> {
        try {
            const allPlants = await this.getPlants();
            return allPlants.filter(plant => plant.clientId === clientId);
        } catch (error) {
            console.error('Failed to get plants by client:', error);
            throw new Error('Не удалось загрузить растения клиента');
        }
    }

    async getPlantsByFamily(family: string): Promise<Plant[]> {
        try {
            const response = await this.plantApi.apiV1PlantsGet({ family });
            return this.mapPlantDTOsToPlants(response.data);
        } catch (error) {
            console.error('Failed to get plants by family:', error);
            throw new Error('Не удалось загрузить растения по семейству');
        }
    }

    async getPlantStats(): Promise<{
        total: number;
        byFamily: Record<string, number>;
        byClient: Record<string, number>;
    }> {
        try {
            const plants = await this.getPlants();

            const byFamily: Record<string, number> = {};
            const byClient: Record<string, number> = {};

            plants.forEach(plant => {
                byFamily[plant.family] = (byFamily[plant.family] || 0) + 1;

                byClient[plant.clientId] = (byClient[plant.clientId] || 0) + 1;
            });

            return {
                total: plants.length,
                byFamily,
                byClient
            };
        } catch (error) {
            console.error('Failed to get plant stats:', error);
            throw new Error('Не удалось загрузить статистику растений');
        }
    }
}

export const plantService = new PlantService();