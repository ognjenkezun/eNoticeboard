import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Statistic } from 'src/app/models/Statistic';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

    apiURL: string = 'http://localhost:5000/api/';

    constructor(private _httpClient: HttpClient, private fb: FormBuilder) { 

    }

    announcementForm = this.fb.group({
        'announcementCategory': new FormControl(null,
            Validators.required
        ),
        'announcementImportant': new FormControl(
        ),
        'announcementTitle': new FormControl('',
            Validators.required
        ),
        'announcementDescription': new FormControl('',
            Validators.required
        ),
        'announcementExpiryDate': new FormControl('',
            Validators.required
        )
    });

    announcementSearchForm = this.fb.group({
        'announcementCategory': new FormControl(0),
        'announcementImportant': new FormControl(false),
        'announcementTitle': new FormControl(''),
        'announcementDescription': new FormControl(''),
        'announcementExpiryDate': new FormControl(''),
        'announcementUserCreated': new FormControl(''),
        'announcementUserModified': new FormControl(''),
        'announcementDateCreated': new FormControl(''),
        'announcementDateModified': new FormControl('')
    });

    announcementSortForm = this.fb.group({
        'ascendingSortDirectionFlag' : new FormControl(false),
        'descendingSortDirectionFlag' : new FormControl(false),
        'titleFlag' : new FormControl(false),
        'descriptionFlag' : new FormControl(false),
        'categoryFlag' : new FormControl(false),
        'importantFlag' : new FormControl(false),
        'dateCreatedFlag' : new FormControl(false),
        'dateModifiedFlag' : new FormControl(false),
        'authorFlag' : new FormControl(false),
        'modifierFlag' : new FormControl(false)
    });

    public getAnnouncements(): Observable<Announcements[]>{
        return this._httpClient.get<Announcements[]>(`${this.apiURL}Announcement/`);
    }

    public getAnnouncement(id: number): Observable<Announcements>{
        return this._httpClient.get<Announcements>(`${this.apiURL}Announcement/${id}`);
    }

    public deleteAnnouncement(id: number) {
        return this._httpClient.delete(`${this.apiURL}Announcement/${id}`);
    }

    public addAnnouncement(announcement: Announcements): Observable<Announcements> {
        return this._httpClient.post<Announcements>(`${this.apiURL}Announcement/`, announcement);
    }

    public editAnnouncement(id: number, announcement: Announcements): Observable<Announcements> {
        return this._httpClient.put<Announcements>(`${this.apiURL}Announcement/${id}`, announcement);
    }

    public getAnnouncementsDetails(): Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/announcementDetails`);
    }

    public getAnnouncementDetails(id: number): Observable<AnnouncementDetails> {
        return this._httpClient.get<AnnouncementDetails>(`${this.apiURL}Announcement/announcementDetails/${id}`);
    }

    public getAnnouncementsDetailsPage(page: number, pageSize: number): Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/announcementDetails/${page}&${pageSize}`);
    }

    public getAnnouncementDetailsForUserPerPage(page: number, pageSize: number): Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/announcementDetailsForUserPerPage/${page}&${pageSize}`);
    }

    public getNumberOfAnnouncement(): Observable<number> {
        return this._httpClient.get<number>(`${this.apiURL}Announcement/numberOfAnnouncements`);
    }

    public getTheLatestAnnouncementPerPage(page: number, pageSize: number)
                                    : Observable<any> {
        return this._httpClient.get<any>(`${this.apiURL}Announcement/theLatestPerPage/${page}&${pageSize}`);
    }

    public getNumberTheMostImportantAnnouncements(): Observable<number> {
        return this._httpClient.get<number>(`${this.apiURL}Announcement/numberTheMostImportantAnnouncements`);
    }

    public getNumberOfAnnouncementForUser(): Observable<number> {
        return this._httpClient.get<number>(`${this.apiURL}Announcement/announcementNumberForUser`);
    }

    public getAnnouncementFromCategory(id: number, page: number, pageSize: number): Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/announcementDetailsFromCategory/${id}&${page}&${pageSize}`);
    }

    public getNumberOfAnnouncementFromCategory(id: number): Observable<number> {
        return this._httpClient.get<number>(`${this.apiURL}Announcement/numberOfAnnouncementsPerCategory/${id}`);
    }

    public getTheMostImportantAnnouncementsPerPage(page: number, pageSize: number): Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/theMostImportantAnnouncementsPerPage/${page}&${pageSize}`);
    }

    public getFilteredAnnouncements(ann: Announcements, page: number, pageSize: number)
                                    : Observable<any> {
        return this._httpClient.post<any>(`${this.apiURL}Announcement/filteredAnnouncements/${page}&${pageSize}`, ann);
    }

    public getSearchedAnnouncements(searchTerm: string, page: number, pageSize: number)
                                    : Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/search?search-term=${searchTerm}&current-page=${page}&page-size=${pageSize}`);
    }

    public getSearchedAnnouncementsForAdmin(searchTerm: string, page: number, pageSize: number)
                                    : Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/searchByAdmin?search-term=${searchTerm}&current-page=${page}&page-size=${pageSize}`);
    }

    public getFromSameCategory(categoryId: number, announcementId: number)
                                    : Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/announcementDetailsFromSameCategory/${categoryId}&${announcementId}`);
    }

    public getTheMostImportantAnnouncement(numberOfAnnouncements: number): Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/theMostImportant/${numberOfAnnouncements}`);
    }

    public getTheLatestAnnouncement(numberOfAnnouncements: number): Observable<AnnouncementDetails[]> {
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/theLatest/${numberOfAnnouncements}`);
    }

    public getAnnouncementsStatistic(): Observable<Statistic[]> {
        return this._httpClient.get<Statistic[]>(`${this.apiURL}Announcement/announcementStatistic/`);
    }
}