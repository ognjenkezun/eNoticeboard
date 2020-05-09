import { UserTypes } from './UserTypes';
import { Announcements } from './Announcements';

export class Users {
    userId: number;
    userFirstName: string;
    userLastName: string;
    userPassword: string;
    userEmail: string;
    userTypeId: number;

    userType = {} as UserTypes;
    announcements: Announcements[];
}