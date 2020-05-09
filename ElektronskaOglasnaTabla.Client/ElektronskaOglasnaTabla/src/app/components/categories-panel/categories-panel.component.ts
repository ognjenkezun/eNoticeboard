import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/models/Categories';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { Router } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

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
  public listAnnouncements = null as Announcements[];

  public p: number = 1;
  public itmsPerPage: number = 5;
  public searchByCategory: string;

  constructor(private _categoryService: CategoryService,
              private _anouncementService: AnnouncementService,
              private _router: Router) { }

  ngOnInit(): void {
    //this.loadAnnouncements();
    this.loadCategories();
  }

  loadAnnouncements() {
    this._anouncementService.getAnnouncements().subscribe(data => {
      this.listAnnouncements = data;
    });
  }

  loadCategories() {
    this._categoryService.getCategories().subscribe(data => {
      this.listCategory = data;
    });
  }

  onClick(announcementId: number): void {
    this._router.navigate(['/one-announcement-page', announcementId]);
  }
}
