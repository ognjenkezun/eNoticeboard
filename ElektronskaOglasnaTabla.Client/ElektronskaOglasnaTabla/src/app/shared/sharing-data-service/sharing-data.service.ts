import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Announcements } from 'src/app/models/Announcements';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private announcementSource: BehaviorSubject<Announcements> = new BehaviorSubject<Announcements>(new Announcements());
  currentAnnouncement = this.announcementSource.asObservable();
  /*MOZE I    
  
    public getSharingData(){
      return this.announcementSource.asObservable();
    }
    
    PA SE U KOMPONENTAMA PRETPLATITI

    constructor(private _sharingDataService: SharingDataService){
      this._sharingDataService.getSharingData().subscribe(data => console.log(data));
    }
  */

  constructor() { }

  changeAnnouncement(announcement: Announcements) {
    this.announcementSource.next(announcement);
    console.log(announcement);
    console.log(this.announcementSource);
    console.log(this.currentAnnouncement);
  }
}
