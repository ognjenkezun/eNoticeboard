import { UserTypes } from './UserTypes';
import { Announcements } from './Announcements';

export class Users {
    id: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: string;

    userType = {} as UserTypes;
    announcements: Announcements[];
}