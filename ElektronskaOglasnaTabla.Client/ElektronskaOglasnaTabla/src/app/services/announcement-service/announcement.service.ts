import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

    apiURL: string = 'http://localhost:5000/api/';

    constructor(private _httpClient: HttpClient) { 

    }

    public getAnnouncements(): Observable<Announcements[]>{
        return this._httpClient.get<Announcements[]>(`${this.apiURL}Announcement/`);
    }

    public getAnnouncement(id: number): Observable<Announcements>{
        return this._httpClient.get<Announcements>(`${this.apiURL}Announcement/${id}`);
    }

    public deleteAnnouncement(id: number){
        return this._httpClient.delete(`${this.apiURL}Announcement/${id}`);
    }

    public addAnnouncement(announcement: Announcements): Observable<Announcements>{
        return this._httpClient.post<Announcements>(`${this.apiURL}Announcement/`, announcement);
    }

    public editAnnouncement(announcement: Announcements): Observable<Announcements>{
        return this._httpClient.put<Announcements>(`${this.apiURL}Announcement/`, announcement);
    }

    public getAnnouncementDetails(): Observable<AnnouncementDetails[]>{
        return this._httpClient.get<AnnouncementDetails[]>(`${this.apiURL}Announcement/announcementDetails`);
    }
}
