import { setTokenGetter } from '../../api/api-client';
import { userService } from './user-service';
import { adminService } from './admin-service';
import { plantService } from './plant-service';
import { seedService } from './seed-service';
import { journalService } from './journal-service';

export const initializeApp = () => {
    setTokenGetter(() => userService.getToken());

    console.log('App services initialized:', {
        userService: !!userService,
        adminService: !!adminService,
        plantService: !!plantService,
        seedService: !!seedService,
        journalService: !!journalService
    });
};