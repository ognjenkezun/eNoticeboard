import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Router } from '@angular/router';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { Message } from 'src/app/models/Message';
import { CategoriesDetails } from 'src/app/models/CategoriesDetails';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';
import { AppConfig } from 'src/app/models/AppConfig';
import { FileService } from 'src/app/services/file-service/file.service';
import { create } from 'domain';

@Component({
    selector: 'app-central-panel',
    templateUrl: './central-panel.component.html',
    styleUrls: ['./central-panel.component.css'],
    providers: [
        Ng2SearchPipeModule
    ]
})
export class CentralPanelComponent implements OnInit {

    //KREIRATI NIZ OD 12 OVBAVIJESTENJA I TO PRIKAZIVATI, TJ. SAMO NAJNOVIJE!!!!

    //@Input() listOfAnnouncements: AnnouncementDetails[];
    //@Input() listOfAnnouncementsPage: AnnouncementDetails[];
    @Input() listOfTheMostImportantAnnouncements: AnnouncementDetails[] = [];
    @Input() listOfTheLatestAnnouncements: AnnouncementDetails[] = [];

    private _configApp = {} as AppConfig;

    public spinnerTheLatest: boolean;
    public spinnerTheMostImportant: boolean;
    public spinnerCategories: boolean;

    public categoriesNotExist: boolean;

    public list: Announcements[] = [];
    public listOfCategory: CategoriesDetails[] = [];

    public search: string;
    public totalAnnItems: number;
    public selectedPage: number = 1;
    public itmsPerPage: number = 5;

    currentDate: Date;

    imageToShow: any;

    constructor(private _announcementService: AnnouncementService,
                private _router: Router, 
                private _categoryService: CategoryService,
                private _configService: ConfigurationService,
                private _chatService: ChatService,
                private _fileService: FileService) {//
        //this.listOfAnnouncements = ANNOUNCEMENTSARRAY;
        
        this.subscribeToEvents();//
    }

    ngOnInit() {
        this.spinnerTheLatest = true;
        this.spinnerTheMostImportant = true;
        this.spinnerCategories = true;

        this.categoriesNotExist = false;
        this._configApp.numberOfLastAnnPerCategory = 3;

        //Iz konfiga uzeti po koliko se prikazuje po kategoriji
        this.loadConfig();
        this.loadTheLatestAnnouncements();
        this.loadTheMostImportantAnnouncements();
        this.loadCategoriesWithAnnouncements();

        //this.loadAllAnnouncementsDetails();
        //this.loadAllAnnouncementsDetailsPerPage();


        let curr = Date.now();
        let temp = Date.parse('Wed Sep 30 2020 00:34:09 GMT+0200');
        let diff = curr - temp;
        let hours = (diff/(1000*60*60));
        console.log("Current date is -> ", new Date());
        console.log("Current date in milliseconds is -> ", curr);
        console.log("Temp date is -> ", new Date('Wed Sep 29 2020 23:34:09 GMT+0200'));
        console.log("Temp date in milliseconds is -> ", temp);
        console.log("Difference in milliseconds is -> ", diff);
        console.log("Difference in hours is -> ", hours);
    }

    public onCategoryClick(id: number): void {
        this._router.navigate(['categories/', id]);
    }

    public loadConfig(): void {
        this._configService.getConfigData(1).subscribe(data => {
            this._configApp = data;
        });
    }

    private subscribeToEvents(): void {
        this._chatService.messageReceived.subscribe((message: string) => {
                console.log(message);
                this.loadCategoriesWithAnnouncements();
                this.loadTheMostImportantAnnouncements();
                this.loadTheLatestAnnouncements();
                //this.loadAllAnnouncementsDetails();
                //this.loadAllAnnouncementsDetailsPerPage();
        });
    }///

    public loadTheMostImportantAnnouncements(): void {
        this._announcementService.getTheMostImportantAnnouncement(this._configApp.numberOfLastAnnPerCategory).subscribe(data => {
            this.listOfTheMostImportantAnnouncements = data;
            this.spinnerTheMostImportant = false;
            console.log("The most important announcements are => ", this.listOfTheMostImportantAnnouncements);
        }, err => {
            this.spinnerTheMostImportant = false;
        });
    }

    public loadTheLatestAnnouncements(): void {
        this._announcementService.getTheLatestAnnouncement(this._configApp.numberOfLastAnnPerCategory).subscribe(data => {
            this.listOfTheLatestAnnouncements = data;
            this.spinnerTheLatest = false;
            console.log("The latest announcements are => ", this.listOfTheLatestAnnouncements);
        }, err => {
            this.spinnerTheLatest = false;
        });
    }

    public loadCategoriesWithAnnouncements(): void {
        this._categoryService.getCategoriesWithAnnouncements(this._configApp.numberOfLastAnnPerCategory).subscribe(data => {
            this.listOfCategory = data;
            this.spinnerCategories = false;

            if (!this.listOfCategory.length) {
                this.categoriesNotExist = true;
            }
        }, err => { 
            this.spinnerCategories = false;
            this.categoriesNotExist = true;
        });
    }

    public filterAnnPerCat(categoryId: number) {
        let announs: AnnouncementDetails[] = [];
        this.listOfCategory.forEach(cat => {
            if(cat.categoryId == categoryId){
                cat.announcements.forEach(ann => {
                    announs.push(ann);
                })
            }
        });
        return announs;
    }

    // public loadAllAnnouncementsDetails(): void {
    //     this._announcementService.getAnnouncementsDetails().subscribe(data => {
    //         this.listOfAnnouncements = data;
    //         //this.list = data;
    //     });
    // }

    public onPageBoundsCorrection(number: number) {
        this.selectedPage = number;
    }

    public loadAllAnnouncementsDetailsPerPage(): void {
        // this._announcementService.getAnnouncementsDetailsPage(this.selectedPage, this.itmsPerPage).subscribe(data => {
        //     this.listOfAnnouncementsPage = data;
        //     console.log(this.listOfAnnouncementsPage)

        //     //this.loadNumberOfAnnouncements();
        //     this._announcementService.getNumberOfAnnouncement().subscribe(data => {
        //         this.totalAnnItems = data;
        //         console.log(this.totalAnnItems)
        //     });
        // });
    }

    public loadNumberOfAnnouncements(): void {
        this._announcementService.getNumberOfAnnouncement().subscribe(data => {
            this.totalAnnItems = data;
            console.log(this.totalAnnItems)
        });
    }

    public onClick(announcementId: number): void {
        this._router.navigate(['/announcement', announcementId]);
        window.scrollTo(0, 0);
    }

    public onTheLatestClick(): void {
        this._router.navigate(['the-latest']);
    }

    public onTheMostImportantClick(): void {
        this._router.navigate(['the-most-important']);
    }

    public onClickTopPage(){
        window.scrollTo(0, 0);
    }

    // selectPage(event: any) {
    //     this.selectedPage = event;
    //     console.log(event);
    //     this.loadAllAnnouncementsDetailsPerPage();
    // }

    // onItemsPerPageChange(){
    //     this.selectedPage = 1;
    //     this.loadAllAnnouncementsDetailsPerPage();
    // }
}