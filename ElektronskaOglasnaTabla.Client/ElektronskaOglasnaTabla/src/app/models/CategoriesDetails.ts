import { AnnouncementDetails } from './AnnouncementDetails';

export class CategoriesDetails {
    categoryId: number;
    categoryName: string;
    priorityId: number;
    priorityValue: string;

    announcements: AnnouncementDetails[];
}