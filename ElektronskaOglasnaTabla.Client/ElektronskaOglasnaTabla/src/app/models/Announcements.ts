import { Categories } from './Categories';
import { Users } from './Users';

export class Announcements {
    announcementId?: number;
    announcementTitle: string;
    announcementDescription: string;
    announcementDateCreated?: Date;
    announcementDateModified?: Date;
    announcementUserModified?: number;
    announcementExpiryDate: Date;
    announcementImportantIndicator: number;
    userCreatedId?: string;
    userModifiedId?: string;
    categoryId: number;
    announcementShow?: boolean;
    isNew?: boolean;
}