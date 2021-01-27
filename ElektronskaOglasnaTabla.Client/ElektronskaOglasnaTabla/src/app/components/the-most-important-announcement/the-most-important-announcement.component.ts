import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { Announcements } from 'src/app/models/Announcements';
import { Categories } from 'src/app/models/Categories';
import { Users } from 'src/app/models/Users';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';

@Component({
    selector: 'app-the-most-important-announcement',
    templateUrl: './the-most-important-announcement.component.html',
    styleUrls: ['./the-most-important-announcement.component.css']
})
export class TheMostImportantAnnouncementComponent implements OnInit {
    public spinnerAnnouncements: boolean;
    public announcementsNotExist: boolean;

    public listAnnouncements = null as AnnouncementDetails[];
    public ann = {} as Announcements;
    public cat = {} as Categories;
    public listOfAnnouncements = [] as Announcements[];
    public listOfUsers = [] as Users[];
    public listOfCategories = [] as Categories[]

    public selectedPage: number = 1;
    public itmsPerPage: number = 6;
    public totalAnnItems: number;

    constructor(public _announcementService: AnnouncementService,
                private _router: Router) { }

    public ngOnInit(): void {
        this.spinnerAnnouncements = true;
        this.announcementsNotExist = false;
        this.loadTheMostImportantAnnouncementsPerPage();
    }

    public loadTheMostImportantAnnouncementsPerPage(): void {
        this._announcementService.getTheMostImportantAnnouncementsPerPage(this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listAnnouncements = data;
            this.spinnerAnnouncements = false;
            
            if(this.listAnnouncements.length == 0){
                this.announcementsNotExist = true;
            }
        }, err => { 
            this.spinnerAnnouncements = false;
            this.announcementsNotExist = true;
        });

        this.loadNumberOfTheMostImportantAnnouncements();
    }

    public loadNumberOfTheMostImportantAnnouncements(): void {
        this._announcementService.getNumberTheMostImportantAnnouncements().subscribe(data => {
            this.totalAnnItems = data;
        });
    }

    public onClick(announcementId: number): void {
        this._router.navigate(['/announcement', announcementId]);
        window.scrollTo(0, 0);
    }

    public onItemsPerPageChange(){
        this.selectedPage = 1;
        this.loadTheMostImportantAnnouncementsPerPage();
        window.scrollTo(0, 0);
    }

    public selectPage(event: any) {
        this.selectedPage = event;
        this.loadTheMostImportantAnnouncementsPerPage();
        window.scrollTo(0, 0);
        console.log(event);
    }
}
