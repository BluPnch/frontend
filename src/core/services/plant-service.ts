import {
    PlantApi,
    ServerControllersModelsPlantDTO
} from '../../api/generated/api';

class PlantService {
    private plantApi: PlantApi;

    constructor() {
        this.plantApi = new PlantApi();
    }

    async getPlants(family?: string, species?: string) {
        try {
            const response = await this.plantApi.apiV1PlantsGet({ family, species });
            return response.data;
        } catch (error) {
            console.error('Failed to get plants:', error);
            throw error;
        }
    }

    async getPlantById(id: string) {
        try {
            const response = await this.plantApi.apiV1PlantsIdGet({ id });
            return response.data;
        } catch (error) {
            console.error('Failed to get plant:', error);
            throw error;
        }
    }

    async createPlant(plantData: ServerControllersModelsPlantDTO) {
        try {
            const response = await this.plantApi.apiV1PlantsPost({
                serverControllersModelsPlantDTO: plantData
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create plant:', error);
            throw error;
        }
    }

    async updatePlant(id: string, plantData: ServerControllersModelsPlantDTO) {
        try {
            await this.plantApi.apiV1PlantsIdPut({
                id,
                serverControllersModelsPlantDTO: plantData
            });
        } catch (error) {
            console.error('Failed to update plant:', error);
            throw error;
        }
    }

    async deletePlant(id: string) {
        try {
            await this.plantApi.apiV1PlantsIdDelete({ id });
        } catch (error) {
            console.error('Failed to delete plant:', error);
            throw error;
        }
    }
}

export const plantService = new PlantService();