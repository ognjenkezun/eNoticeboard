import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/models/Categories';

import { CategoryService } from 'src/app/services/category-service/category.service';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { AppConfig } from 'src/app/models/AppConfig';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';
import { ChatService } from 'src/app/services/chat-service/chat.service';

@Component({
    selector: 'app-categories-panel',
    templateUrl: './categories-panel.component.html',
    styleUrls: ['./categories-panel.component.css'],
    providers: [
        Ng2SearchPipeModule
    ]
})
export class CategoriesPanelComponent implements OnInit {

    public configApp = {} as AppConfig;
    public listCategory = [] as Categories[];
    public listAnnouncements = [] as AnnouncementDetails[];
    public selectedCategory = {} as Categories;
    public loading = false;
    public spinnerCategories: boolean;

    public selectedPage: number = 1;
    public itmsPerPage: number = 6;
    public totalAnnItems: number;

    constructor(private _categoryService: CategoryService,
                private _announcementService: AnnouncementService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _configService: ConfigurationService,
                private _chatService: ChatService) { 
        
        this.subscribeToEvents();
    }

    ngOnInit(): void {
        this.spinnerCategories = true;

        this.loadCategories();
        // if (+this._route.snapshot.params['id']) {
        //     let id = +this._route.snapshot.params['id'];
        //     this.selectedCategory.categoryId = id;
        // }
        // else {
            // if (this.listCategory.length > 0) {
            //     this.selectedCategory.categoryId = this.listCategory[0].categoryId;
            // }
            // else {
                //this.selectedCategory.categoryId = 0;
            // }
        //}
        this.loadConfig();
        //this.loadAllAnnouncementsDetailsPerPage();
        console.log("Selekcted categoty onInit => ", this.selectedCategory.categoryId);
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
            this.loadCategories();
            this.loadAllAnnouncementsDetailsPerPage(this.selectedCategory.categoryId);
        });
    }

    loadDefaultAnnouncementsDetails() {
        this._announcementService.getAnnouncementFromCategory(this.listCategory[0].categoryId, this.selectedPage, this.itmsPerPage)
            .subscribe(data => {
                this.listAnnouncements = data;
                this.spinnerCategories = false;
                console.log(this.listAnnouncements);
                this.loading = false;
                this._announcementService.getNumberOfAnnouncementFromCategory(this.listCategory[0].categoryId ?? 0)
                    .subscribe(data => {
                        this.totalAnnItems = data;
                        console.log(this.totalAnnItems)
                    });
        }, err => {
            this.spinnerCategories = false;
        });
    }

    loadCategories() {
        this._categoryService.getCategories().subscribe(data => {
            this.listCategory = data;
            
            //console.log("Data ", data);
            if (+this._route.snapshot.params['id']) {
                let id = +this._route.snapshot.params['id'];
                this.selectedCategory.categoryId = id;
            }
            else {

                this.selectedCategory.categoryId = this.listCategory[0].categoryId || 0;
            }
            
            console.log("Selekcted categoty loadCategories => ", this.selectedCategory.categoryId);
            this.loadAllAnnouncementsDetailsPerPage(this.selectedCategory.categoryId);
        });
    }

    onClick(announcementId: number): void {
        this._router.navigate(['/announcement', announcementId]);
        window.scrollTo(0, 0);
    }

    onCategoryChange() {
        this.selectedPage = 1;
        this._router.navigate(['/categories', this.selectedCategory.categoryId]);
        this.loadAllAnnouncementsDetailsPerPage(this.selectedCategory.categoryId);
        console.log(this.selectedCategory.categoryId);
    }

    onItemsPerPageChange() {
        this.selectedPage = 1;
        this.loadAllAnnouncementsDetailsPerPage(this.selectedCategory.categoryId);
        window.scrollTo(0, 0);
    }

    onPageChange(event: number) {
        this.selectedPage = event;
        this.selectedPage = event;
        console.log(event);
        this.loadAllAnnouncementsDetailsPerPage(this.selectedCategory.categoryId);
        window.scrollTo(0, 0);
    }

    selectPage(event: any) {
        this.selectedPage = event;
        console.log(event);
        this.loadAllAnnouncementsDetailsPerPage(this.selectedCategory.categoryId);
        window.scrollTo(0, 0);
    }

    loadAllAnnouncementsDetailsPerPage(categoryId: number) {
        this._announcementService.getAnnouncementFromCategory(categoryId, this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listAnnouncements = data;
            console.log("Ann => ", this.listAnnouncements);
            this.spinnerCategories = false;
            this._announcementService.getNumberOfAnnouncementFromCategory(categoryId).subscribe(data => {
                this.totalAnnItems = data;
                console.log(this.totalAnnItems)
            });
        }, err => {
            this.spinnerCategories = false;
        });
    }
}