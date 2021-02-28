import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { Router } from '@angular/router';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { CategoriesDetails } from 'src/app/models/CategoriesDetails';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';
import { AppConfig } from 'src/app/models/AppConfig';

@Component({
    selector: 'app-central-panel',
    templateUrl: './central-panel.component.html',
    styleUrls: ['./central-panel.component.css']
})
export class CentralPanelComponent implements OnInit {

    public listOfTheMostImportantAnnouncements: AnnouncementDetails[] = [];
    public listOfTheLatestAnnouncements: AnnouncementDetails[] = [];
    public listOfCategory: CategoriesDetails[] = [];

    public configApp = {} as AppConfig;

    public deletedAnnouncementId: number = 0;

    public spinnerTheLatest: boolean;
    public spinnerTheMostImportant: boolean;
    public spinnerCategories: boolean;

    public categoriesNotExist: boolean;

    currentDate: Date;

    constructor(private _announcementService: AnnouncementService,
                private _router: Router, 
                private _categoryService: CategoryService,
                private _configService: ConfigurationService) { }

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
            console.log("DATA => ", data);
            
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