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
import { SignalRService } from 'src/app/services/signal-r/signal-r.service';

@Component({
    selector: 'app-central-panel',
    templateUrl: './central-panel.component.html',
    styleUrls: ['./central-panel.component.css'],
    providers: [
        Ng2SearchPipeModule
    ]
})
export class CentralPanelComponent implements OnInit {

    @Input() listOfTheMostImportantAnnouncements: AnnouncementDetails[] = [];
    @Input() listOfTheLatestAnnouncements: AnnouncementDetails[] = [];

    public configApp = {} as AppConfig;

    public spinnerTheLatest: boolean;
    public spinnerTheMostImportant: boolean;
    public spinnerCategories: boolean;

    public categoriesNotExist: boolean;

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
                private _signalRService: SignalRService,
                private _chatService: ChatService) {
        
        this.subscribeToEvents();
    }

    ngOnInit() {
        this.spinnerTheLatest = true;
        this.spinnerTheMostImportant = true;
        this.spinnerCategories = true;

        this.categoriesNotExist = false;

        this.loadConfig();
    }

    public onCategoryClick(id: number): void {
        this._router.navigate(['categories/', id]);
    }

    public loadConfig(): void {
        this._configService.getConfigData(1).subscribe(data => {
            this.configApp.numberOfLastAnnPerCategory = data.numberOfLastAnnPerCategory || 3;
            this.configApp.announcementExpiry = data.announcementExpiry || 1;
            this.loadTheMostImportantAnnouncements(this.configApp.numberOfLastAnnPerCategory);
            this.loadTheLatestAnnouncements(this.configApp.numberOfLastAnnPerCategory);
            this.loadCategoriesWithAnnouncements(this.configApp.numberOfLastAnnPerCategory);

            console.log("Config => ", this.configApp);
            console.log("Data => ", data);
        });
    }

    public isNew(announcement: AnnouncementDetails): boolean {
        let currentTime = Date.now();
        
        let dateCreated = Date.parse(announcement.announcementDateCreated.toString());
        let differenceInMillicecondsCreated = currentTime - dateCreated;
        let hoursCreated = (differenceInMillicecondsCreated / (1000 * 60 * 60));

        if (announcement.announcementDateModified != null) {
            let dateModified = Date.parse(announcement.announcementDateModified.toString());
            let differenceInMillicecondsModified = currentTime - dateModified;
            var hoursModified = (differenceInMillicecondsModified / (1000 * 60 * 60)) || 0;
        }

        if (Math.abs(hoursCreated) < (this.configApp.announcementExpiry * 24) ||
            Math.abs(hoursModified) < (this.configApp.announcementExpiry * 24)) {
                return true;
        }
        else {
            return false;
        }
    }

    public convertStringWithHtmlTagsToText(text: string): string {
        let tmp = document.createElement("element");
        tmp.innerHTML = text;
        return tmp.textContent || tmp.innerText || "";
    }

    private subscribeToEvents(): void {
        this._chatService.messageReceived.subscribe((message: string) => {
            console.log(message);
            this.loadConfig();
        });

        this._signalRService.announcementRecieved.subscribe((newAnnouncement: AnnouncementDetails) => {
            console.warn("ADDED SIGNAL R ANNOUNCEMENT IS => ", newAnnouncement);
            
            newAnnouncement.isNew = this.isNew(newAnnouncement);
            newAnnouncement.announcementDescription = this.convertStringWithHtmlTagsToText(newAnnouncement.announcementDescription);
            
            this.listOfTheLatestAnnouncements.unshift(newAnnouncement);
            this.listOfTheLatestAnnouncements.pop();

            if (newAnnouncement.importantIndicator > 0) {
                this.listOfTheMostImportantAnnouncements.unshift(newAnnouncement);
                this.listOfTheMostImportantAnnouncements.pop();
            }
            this.listOfCategory.forEach(category => {
                if (category.categoryId === newAnnouncement.categoryId) {
                    category.announcements.unshift(newAnnouncement);
                    category.announcements.pop();
                }
            });
        });

        this._signalRService.updatedAnnouncementRecieved.subscribe((updatedAnnouncement: AnnouncementDetails) => {
            console.warn("UPDATED SIGNAL R ANNOUNCEMENT IS => ", updatedAnnouncement);

            updatedAnnouncement.isNew = this.isNew(updatedAnnouncement);

            let findedIndexInTheLatest = this.listOfTheLatestAnnouncements.findIndex(announcement => announcement.announcementId === updatedAnnouncement.announcementId);
            if (findedIndexInTheLatest != -1) {
                this.listOfTheLatestAnnouncements[findedIndexInTheLatest] = updatedAnnouncement;
            }
            else {
                this.listOfTheLatestAnnouncements.unshift(updatedAnnouncement);
                this.listOfTheLatestAnnouncements.pop();
            }
            let findedIndexInTheMostImportant = this.listOfTheMostImportantAnnouncements.findIndex(announcement => announcement.announcementId === updatedAnnouncement.announcementId);
            if (findedIndexInTheMostImportant != -1) {
                this.listOfTheMostImportantAnnouncements[findedIndexInTheMostImportant] = updatedAnnouncement;
            }
            else {
                this.listOfTheMostImportantAnnouncements.unshift(updatedAnnouncement);
                this.listOfTheMostImportantAnnouncements.pop();
                //this.listOfTheMostImportantAnnouncements.filter(val => val);
            }
            this.listOfCategory.forEach(category => {
                if (category.categoryId === updatedAnnouncement.categoryId) {
                    let findedIndexAnnouncementInCategory = category.announcements.findIndex(announcement => announcement.announcementId === updatedAnnouncement.announcementId);
                    if (findedIndexAnnouncementInCategory != -1) {
                        category.announcements[findedIndexAnnouncementInCategory] = updatedAnnouncement;
                    }
                    else {
                        category.announcements.unshift(updatedAnnouncement);
                        category.announcements.pop();
                    }
                }
            });
        });

        this._signalRService.deletedAnnouncementIdRecieved.subscribe((deletedAnnouncementId: number) => {
            let nextAnnounce = {} as AnnouncementDetails;

            //let deletedIndex = this.listOfUserAnnouncements.findIndex(announcement => announcement.announcementId === deletedAnnouncementId);
            //this.listOfUserAnnouncements.splice(deletedIndex, 1);
            //this.listOfUserAnnouncements.push(nextAnnounce);

            //nextAnnounce = null;
            //Pozvati u API-u da se izracuna sljedeci najmladji announcemnt i vratiti ga sa ID-om
        });
    }

    public loadTheMostImportantAnnouncements(annPerCategory: number): void {
        this._announcementService.getTheMostImportantAnnouncement(annPerCategory).subscribe(data => {
            this.listOfTheMostImportantAnnouncements = data;
            this.spinnerTheMostImportant = false;
            console.log("The most important announcements are => ", this.listOfTheMostImportantAnnouncements);
        }, err => {
            this.spinnerTheMostImportant = false;
        });
    }

    public loadTheLatestAnnouncements(annPerCategory: number): void {
        this._announcementService.getTheLatestAnnouncement(annPerCategory).subscribe(data => {
            this.listOfTheLatestAnnouncements = data;
            this.spinnerTheLatest = false;
            console.log("The latest announcements are => ", this.listOfTheLatestAnnouncements);
        }, err => {
            this.spinnerTheLatest = false;
        });
    }

    public loadCategoriesWithAnnouncements(annPerCategory: number): void {
        this._categoryService.getCategoriesWithAnnouncements(annPerCategory).subscribe(data => {
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

    public onPageBoundsCorrection(number: number) {
        this.selectedPage = number;
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
}