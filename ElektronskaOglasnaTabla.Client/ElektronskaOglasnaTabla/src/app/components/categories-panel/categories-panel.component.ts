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

@Component({
    selector: 'app-categories-panel',
    templateUrl: './categories-panel.component.html',
    styleUrls: ['./categories-panel.component.css'],
    providers: [
        Ng2SearchPipeModule
    ]
})
export class CategoriesPanelComponent implements OnInit {

    public listCategory = null as Categories[];
    public listAnnouncements = null as AnnouncementDetails[];
    public selectedCategory = {categoryName: "sdad", categoryId:1, priorityId:1} as Categories;
    public loading = false;
    public spinnerCategories: boolean;

    public selectedPage: number = 1;
    public itmsPerPage: number = 6;
    public totalAnnItems: number;

    constructor(private _categoryService: CategoryService,
                private _announcementService: AnnouncementService,
                private _route: ActivatedRoute,
                private _router: Router) { }

    ngOnInit(): void {
        this.spinnerCategories = true;

        if(+this._route.snapshot.params['id']) {
            let id = +this._route.snapshot.params['id'];
            this.selectedCategory.categoryId = id;
        }
        else {
            this.selectedCategory.categoryId = 0;
        }

        this.loadCategories();
        this.loadAllAnnouncementsDetailsPerPage();
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
            //this.selectedCategory.categoryId = this.listCategory[0].categoryId;
        });
    }

    onClick(announcementId: number): void {
        this._router.navigate(['/announcement', announcementId]);
        window.scrollTo(0, 0);
    }

    onCategoryChange() {
        this.selectedPage = 1;
        this._router.navigate(['/categories', this.selectedCategory.categoryId]);
        this.loadAllAnnouncementsDetailsPerPage();
        console.log(this.selectedCategory.categoryId);
    }

    onItemsPerPageChange() {
        this.selectedPage = 1;
        this.loadAllAnnouncementsDetailsPerPage();
        window.scrollTo(0, 0);
    }

    onPageChange(event: number) {
        this.selectedPage = event;
        this.selectedPage = event;
        console.log(event);
        this.loadAllAnnouncementsDetailsPerPage();
        window.scrollTo(0, 0);
    }

    selectPage(event: any) {
        this.selectedPage = event;
        console.log(event);
        this.loadAllAnnouncementsDetailsPerPage();
    }

    loadAllAnnouncementsDetailsPerPage() {
        this._announcementService.getAnnouncementFromCategory(this.selectedCategory.categoryId, this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listAnnouncements = data;
            console.log(this.listAnnouncements);
            this.spinnerCategories = false;
            this._announcementService.getNumberOfAnnouncementFromCategory(this.selectedCategory.categoryId).subscribe(data => {
                this.totalAnnItems = data;
                console.log(this.totalAnnItems)
            });
        }, err => {
            this.spinnerCategories = false;
        });
    }
}