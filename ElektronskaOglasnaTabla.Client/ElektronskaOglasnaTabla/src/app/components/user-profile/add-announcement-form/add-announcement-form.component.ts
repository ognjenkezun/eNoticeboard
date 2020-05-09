import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { DatePipe } from '@angular/common';
import { NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Categories } from 'src/app/models/Categories';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { ToastrService } from 'ngx-toastr';
import { SharingDataService } from 'src/app/shared/sharing-data-service/sharing-data.service';

@Component({
  selector: 'app-add-announcement-form',
  templateUrl: './add-announcement-form.component.html',
  styleUrls: ['./add-announcement-form.component.css']
})
export class AddAnnouncementFormComponent implements OnInit {

  //IMPLEMENTIRATI OVDJE I EDIT!!!!!!!!!!!!!!

  public addAnnouncementForm: FormGroup;
  public announcement = {} as Announcements;
  public listOfCategories = [] as Categories[];
  public newCategory = {} as Categories;
  public selectedCategoryId: number;
  public importantIndicator: boolean;
  public importantIndicatorToNumber: number;
  //public currentDateAndTime: Date = new Date();

  public pipe = new DatePipe('en-US');
  public now = Date.now();
  public customDateFormat = this.pipe.transform(this.now, "dd-MM-YYYY");

  public annDescription: string = "";

  constructor(private _announcementService: AnnouncementService, 
              private _categoryService: CategoryService,
              private toastr: ToastrService,
              private _sharingDataService: SharingDataService) { }

  ngOnInit() {

    this.addAnnouncementForm = new FormGroup({
      'announcementCategory': new FormControl(this.listOfCategories[0],
        Validators.required
      ),
      'announcementImportant': new FormControl(false,
        Validators.required
      ),
      'announcementTitle': new FormControl('',
        Validators.required
      ),
      'announcementDescription': new FormControl('',
        Validators.required
      )
    });

    this.importantIndicator = false;
    this.importantIndicatorToNumber = 0;
    this.loadCategories();
  }

  loadCategories(): void {
    this._categoryService.getCategories().subscribe(data => {
      this.listOfCategories = data;
    });
  }

  get announcementCategory() { return this.addAnnouncementForm.get('announcementCategory') }

  get announcementPriority() { return this.addAnnouncementForm.get('announcementPriority') }

  get announcementTitle() { return this.addAnnouncementForm.get('announcementTitle') }

  get announcementDescription() { return this.addAnnouncementForm.get('announcementDescription') }

  onSubmit(): void {
    let currentDateAndTime: Date = new Date();
    //let dateFormat = require('dateformat');
    //let dateTimeNow = new Date();
    //dateFormat(dateTimeNow, "dd.mm.yyyy. HH:MM:ss");

    console.warn(this.addAnnouncementForm.value);

    if(this.importantIndicator){
      this.importantIndicatorToNumber = 1;
    }
    else{
      this.importantIndicatorToNumber = 0;
    }

    let announcementAA = {
      announcementTitle: this.addAnnouncementForm.get('announcementTitle').value.toString(),
      announcementDescription: this.addAnnouncementForm.get('announcementDescription').value.toString(),
      announcementDateCreated: currentDateAndTime,
      announcementDateModified: currentDateAndTime,
      announcementExpiryDate: currentDateAndTime,
      announcementImportantIndicator: this.importantIndicatorToNumber,
      userId: 1,
      categoryId: this.selectedCategoryId,
      isDeleted: false
    }

    console.log(announcementAA);

    this._sharingDataService.changeAnnouncement(announcementAA);

    this._announcementService.addAnnouncement(announcementAA).subscribe(
      (res: any) => {
        if(res.succeeded) {
          this.toastr.success('Novo obavještenje dodato!', 'Dodavanje uspješno.');
        }
        else {
          this.toastr.error(res.errors, 'Dodavanje nije uspjelo.');
        }
    },
    err => {
      console.log(err);
    });

    this.addAnnouncementForm.reset();
  }

  public addNewCategory(): void {

    let newCat = {
      categoryName: this.newCategory.categoryName,
      priorityId: 1
    }

    this._categoryService.addCategory(newCat).subscribe(
      (res: any) => {
        if(res.succeeded) {
          this.toastr.success('Nova kategorija dodata!', 'Dodavanje uspješno.');
        }
        else {
          this.toastr.error(res.errors, 'Dodavanje nije uspjelo.');
        }
        this.newCategory.categoryName = null;
        this.loadCategories();
        //this.newCategory.categoryId = this.selectedCategoryId;
        //this.selectedCategoryId = null;
        this.listOfCategories.forEach(element => {
          if(element.categoryName === this.newCategory.categoryName){
            this.selectedCategoryId = element.categoryId;
          }
        });
    },
    err => {
      console.log(err);
    }); //toastr-om postaviti obavjestenje
  }
}
