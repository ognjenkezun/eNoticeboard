import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { Announcements } from 'src/app/models/Announcements';
import { AppConfig } from 'src/app/models/AppConfig';
import { Categories } from 'src/app/models/Categories';
import { Users } from 'src/app/models/Users';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';

@Component({
    selector: 'app-the-latest',
    templateUrl: './the-latest.component.html',
    styleUrls: ['./the-latest.component.css']
})
export class TheLatestComponent implements OnInit {
    public spinnerAnnouncements: boolean;
    public announcementsNotExist: boolean;

    public configApp = {} as AppConfig;
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
                private _configService: ConfigurationService,
                private _router: Router,
                private _chatService: ChatService) {

        this.subscribeToEvents();
    }

    public ngOnInit(): void {
        this.spinnerAnnouncements = true;
        this.announcementsNotExist = false;
        this.loadConfig();
        this.loadTheMostImportantAnnouncementPerPage();
    };

    public loadConfig(): void {
        this._configService.getConfigData(1).subscribe(data => {
            this.configApp.announcementExpiry = data.announcementExpiry || 1;
        });
    }

    private subscribeToEvents(): void {
        this._chatService.messageReceived.subscribe((message: string) => {
            console.log(message);
            this.loadConfig();
            this.loadTheMostImportantAnnouncementPerPage();
        });
    }

    public loadTheMostImportantAnnouncementPerPage(): void {
        this._announcementService.getTheLatestAnnouncementPerPage(this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listAnnouncements = data['result'];
            this.totalAnnItems = data['numberOfAnnouncements'];
            this.spinnerAnnouncements = false;
            
            if(this.listAnnouncements.length == 0){
                this.announcementsNotExist = true;
            }
        }, err => { 
            this.spinnerAnnouncements = false;
            this.announcementsNotExist = true;
        });
    }

    public onClick(announcementId: number): void {
        this._router.navigate(['/announcement', announcementId]);
        window.scrollTo(0, 0);
    }

    public onItemsPerPageChange(){
        this.selectedPage = 1;
        this.loadTheMostImportantAnnouncementPerPage();
        window.scrollTo(0, 0);
    }

    public selectPage(event: any) {
        this.selectedPage = event;
        this.loadTheMostImportantAnnouncementPerPage();
        window.scrollTo(0, 0);
        console.log(event);
    }
}
