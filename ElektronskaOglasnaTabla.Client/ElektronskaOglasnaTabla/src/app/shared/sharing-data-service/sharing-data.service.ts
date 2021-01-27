import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Announcements } from 'src/app/models/Announcements';

@Injectable({
    providedIn: 'root'
})
export class SharingDataService {

    private announcementSource: BehaviorSubject<Announcements> = new BehaviorSubject<Announcements>(new Announcements());
    currentAnnouncement = this.announcementSource.asObservable();

    private loggedIn = localStorage.getItem('token') ? new BehaviorSubject<boolean>(true) : new BehaviorSubject<boolean>(false);
    //private admin = localStorage.getItem('role') == "Administrator" ? new BehaviorSubject<boolean>(true) : new BehaviorSubject<boolean>(false);
    private admin = localStorage.getItem('role') === "Administrator" ? new BehaviorSubject<boolean>(true) : new BehaviorSubject<boolean>(false);
    private userRole = localStorage.getItem('role') ?? "";
    private userName = localStorage.getItem('username') ? new BehaviorSubject<string>(localStorage.getItem('username')) : new BehaviorSubject<string>("");

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    get isAdmin() {
        return this.admin.asObservable();
    }

    setAdminFlag(role: string) {
        if (role == "Administrator") {
            this.admin.next(true);
        }
    }

    get getRole() {
        return this.userRole;
    }

    get getUserName() {
        return this.userName.asObservable();
    }

    setUserName(username: string) {
        this.userName.next(username);
    }

    // private loggin = new BehaviorSubject<boolean>(false);

    // get isLoggin() {
    //     return this.loggin.asObservable();
    // }

    // private loggedInSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // loggedIn = this.loggedInSource.asObservable();
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

    // login(isLogin: boolean){
    //     this.loggedInSource.next(true);
    // }
  
    // logout(isLogin: boolean) {
    //     this.loggedInSource.next(false);
    // }

    login() {
        this.loggedIn.next(true);
    }

    logout() {
        this.loggedIn.next(false);
        this.admin.next(false);
        this.userName.next("");
    }
}
