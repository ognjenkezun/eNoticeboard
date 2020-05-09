import { Categories } from './Categories';
import { Users } from './Users';

export class Announcements {
    announcementId?: number;
    announcementTitle: string;
    announcementDescription: string;
    announcementDateCreated: Date;
    announcementDateModified?: Date;
    announcementUserModified?: number;
    announcementExpiryDate?: Date;
    announcementImportantIndicator: number;
    userId: number;
    categoryId: number;
    isDeleted: boolean;

    /*categories: Categories;
    users: Users;
    announcementImageId: number[];*/
}