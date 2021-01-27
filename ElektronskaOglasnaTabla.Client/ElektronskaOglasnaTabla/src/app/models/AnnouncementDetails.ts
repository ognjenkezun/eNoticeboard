import { Files } from "./Files";

export class AnnouncementDetails {
      announcementId: number;
      announcementTitle: string;
      announcementDescription: string;
      announcementDateCreated: Date;
      announcementDateModified: Date;
      announcementExpiryDate: Date;
      importantIndicator: number;
      userCreatedId: string;
      userCreatedFirstName: string;
      userCreatedLastName: string;
      userCreatedEmail: string;
      userCreatedTypeId: number;
      userCreatedTypeName: string;
      userModifiedId?: string;
      userModifiedFirstName: string;
      userModifiedLastName: string;
      userModifiedEmail: string;
      userModifiedTypeId: number;
      userModifiedTypeName: string;
      categoryId: number;
      categoryName: string;
      priorityId: number;
      priorityValue: string;
      announcementShow: boolean;
      isNew?: boolean;

      files: Files[];
}