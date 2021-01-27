import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { DatePipe } from '@angular/common';
import { NgbCalendar, NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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

  public currentDate: Date;
  //public currentDateAndTime: Date = new Date();

  model: NgbDateStruct

  public pipe = new DatePipe('en-US');
  public now = Date.now();
  public customDateFormat = this.pipe.transform(this.now, "dd-MM-YYYY");

  public annDescription: string = "";

  constructor(private _announcementService: AnnouncementService, 
              private _categoryService: CategoryService,
              private toastr: ToastrService,
              private _sharingDataService: SharingDataService) { }

  ngOnInit() {

    this.currentDate = new Date();

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
      ),
      'announcementExpiryDate': new FormControl('',
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

  get announcementPriority() { return this.addAnnouncementForm.get('announcementImportant') }

  get announcementTitle() { return this.addAnnouncementForm.get('announcementTitle') }

  get announcementDescription() { return this.addAnnouncementForm.get('announcementDescription') }

  get announcementExpiryDate() { return this.addAnnouncementForm.get('announcementExpiryDate') }

  onSubmit(): void {
    let currentDateAndTime: Date = new Date();
    //let dateFormat = require('dateformat');
    //let dateTimeNow = new Date();
    //dateFormat(dateTimeNow, "dd.mm.yyyy. HH:MM:ss");
    console.log("ADD button clicked");
    console.warn(this.addAnnouncementForm.value);

    if(this.addAnnouncementForm.get('announcementImportant').value){
      this.importantIndicatorToNumber = 1;
    }
    else{
      this.importantIndicatorToNumber = 0;
    }

    let announcement = {
      announcementTitle: this.addAnnouncementForm.get('announcementTitle').value,
      announcementDescription: this.addAnnouncementForm.get('announcementDescription').value,
      announcementDateCreated: currentDateAndTime,
      announcementExpiryDate: this.addAnnouncementForm.get('announcementExpiryDate').value,
      announcementImportantIndicator: this.importantIndicatorToNumber,
      userId: 2,
      categoryId: this.addAnnouncementForm.get('announcementCategory').value,
      announcementShow: false,
      userIdentity: ""
    }

    console.log(announcement);

    this._sharingDataService.changeAnnouncement(announcement);

    this._announcementService.addAnnouncement(announcement).subscribe(
      (res: any) => {
          this.toastr.success('Novo obavještenje dodato!', 'Dodavanje uspješno.');
          this.addAnnouncementForm.reset();
      },
      err => {
        this.toastr.error(err, 'Dodavanje nije uspjelo.');
        console.log(err);
    });
  }
}
