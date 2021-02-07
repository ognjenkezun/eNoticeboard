import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { Users } from 'src/app/models/Users';
import { Categories } from 'src/app/models/Categories';
import { UserService } from 'src/app/services/user-service/user.service';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/models/AppConfig';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
    public spinnerAnnouncements: boolean;
    public announcementsNotExist: boolean;

    public selectImportant: string;

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

    //public userCreatedId: string = "lll";

    title: string = null;
    description: string = null;
    categoryId: number = 0;
    userCreatedId: string = "";
    userModifiedId: string = "";
    important: number = 0;
    importantFlag: boolean;

    constructor(public _announcementService: AnnouncementService,
                private _categoryService: CategoryService,
                private _userService: UserService,
                private _router: Router,
                private _chatService: ChatService,
                private _configService: ConfigurationService) { 
                    
        this.subscribeToEvents();
    }

    ngOnInit(): void {
        this.spinnerAnnouncements = true;
        this.announcementsNotExist = false;

        this.loadConfig();
        this.loadFilteredAnouncements();
        this.loadCategories();
        this.loadUsers();
    }

    ngOnDestroy(): void {
        this._announcementService.announcementSearchForm.reset();
        this._announcementService.announcementSearchForm.controls['announcementCategory'].setValue(0);
    }

    public loadConfig(): void {
        this._configService.getConfigData(1).subscribe(data => {
            this.configApp.announcementExpiry = data.announcementExpiry || 1;
        });
    }

    private subscribeToEvents(): void {
        this._chatService.messageReceived.subscribe((message: string) => {
            console.log(message);
            this.loadConfig();
            this.loadFilteredAnouncements();
            this.loadCategories();
            this.loadUsers();
        });
    }

    public loadFilteredAnouncements() {
        this._announcementService.getFilteredAnnouncements(this.ann, this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listAnnouncements = data['result'];
            this.totalAnnItems = data['numberOfAnnouncement'];
            console.log("Filtered and number of them ", data['result'], data['numberOfAnnouncement']);
            
            this.spinnerAnnouncements = false;
            
            if(this.listAnnouncements.length == 0) {
                this.announcementsNotExist = true;
            }
        }, err => { 
            this.spinnerAnnouncements = false;
            this.announcementsNotExist = true;
        });
    }

    public loadCategories() {
        this._categoryService.getCategories().subscribe(data => {
            this.listOfCategories = data;
            console.log(data);
        });
    }

    public loadUsers() {
        this._userService.getUsers().subscribe(data => {
            this.listOfUsers = data;
            console.log(this.listOfUsers);
        });
    }

    public onClick(announcementId: number): void {
        this._router.navigate(['/announcement', announcementId]);
        window.scrollTo(0, 0);
    }

    public onSortSubmit(): void {

    }

    public onSearchSubmit() {
        this.selectedPage = 1;
        if (this._announcementService.announcementSearchForm.get('announcementImportant').value) {
            this.important = 1;
        }
        else {
            this.important = 0;
        }
        console.log(this.title);
        console.log(this.description);
        console.log(this.categoryId);
        console.log(this.userCreatedId);
        console.log(this.userModifiedId);
        console.log("Imp ! => ", this.important);

        this.ann.announcementTitle = this._announcementService.announcementSearchForm.get('announcementTitle').value;
        this.ann.announcementDescription = this._announcementService.announcementSearchForm.get('announcementDescription').value;
        this.ann.userCreatedId = this._announcementService.announcementSearchForm.get('announcementUserCreated').value;
        this.ann.userModifiedId = this._announcementService.announcementSearchForm.get('announcementUserModified').value;
        this.ann.announcementImportantIndicator = this.important;
        this.ann.categoryId = this._announcementService.announcementSearchForm.get('announcementCategory').value;
        this.ann.announcementDateCreated = this._announcementService.announcementSearchForm.get('announcementDateCreated').value;
        if (this._announcementService.announcementSearchForm.get('announcementDateCreated').value) {
            let date = new Date();
            this.ann.announcementDateCreated.setHours(date.getHours() + 1);
            this.ann.announcementDateCreated.setMinutes(date.getMinutes());
            this.ann.announcementDateCreated.setSeconds(date.getSeconds());
        }
        this.ann.announcementDateModified = this._announcementService.announcementSearchForm.get('announcementDateModified').value;
        if (this._announcementService.announcementSearchForm.get('announcementDateModified').value) {
            let date = new Date();
            this.ann.announcementDateModified.setHours(date.getHours() + 1);
            this.ann.announcementDateModified.setMinutes(date.getMinutes());
            this.ann.announcementDateModified.setSeconds(date.getSeconds());
        }
        
        console.log("Form data => ", this._announcementService.announcementSearchForm.value);
        
        
        this._announcementService.getFilteredAnnouncements(this.ann, this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listAnnouncements = data['result'];
            this.totalAnnItems = data['numberOfAnnouncement'];

            console.log(data);
            //FORM RESET
            this.title = "";
            this.description = "";
            this.categoryId = 0;
            this.userCreatedId = "";
            this.userModifiedId = "";
            this.important = 0;

            this._announcementService.announcementSearchForm.reset();
            this._announcementService.announcementSearchForm.controls['announcementCategory'].setValue(0);
        });
    }

    public onSearch() {
        if (this.importantFlag) {
            this.important = 1;
        }
        else {
            this.important = 0;
        }
        console.log(this.title);
        console.log(this.description);
        console.log(this.categoryId);
        console.log(this.userCreatedId);
        console.log(this.userModifiedId);
        console.log(this.important);

        this.ann.announcementTitle = this.title ?? "";
        this.ann.announcementDescription = this.description ?? "";
        this.ann.userCreatedId = this.userCreatedId ?? "";
        this.ann.userModifiedId = this.userModifiedId ?? "";
        this.ann.announcementImportantIndicator = this.important;
        this.ann.categoryId = this.categoryId ?? 0;

        this._announcementService.getFilteredAnnouncements(this.ann, this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listAnnouncements = data;

            console.log(data);
            //FORM RESET
            this.title = "";
            this.description = "";
            this.categoryId = 0;
            this.userCreatedId = "";
            this.userModifiedId = "";
            this.important = 0;
        });

        this.selectedPage = 1;
    }

    public onDeleteSearchFields(): void {
        this.title = "";
        this.description = "";
        this.categoryId = 0;
        this.userCreatedId = "";
        this.userModifiedId = "";
        this.important = 0;
        this.importantFlag = false;
        this._announcementService.announcementSearchForm.reset();
        this._announcementService.announcementSearchForm.controls['announcementCategory'].setValue(0);
        this.loadFilteredAnouncements();
    }

    public onItemsPerPageChange() {
        this.selectedPage = 1;
        this.loadFilteredAnouncements();
        window.scrollTo(0, 0);
    }

    public selectPage(event: any) {
        this.selectedPage = event;
        this.loadFilteredAnouncements();
        window.scrollTo(0, 0);
        console.log(event);
    }
}
