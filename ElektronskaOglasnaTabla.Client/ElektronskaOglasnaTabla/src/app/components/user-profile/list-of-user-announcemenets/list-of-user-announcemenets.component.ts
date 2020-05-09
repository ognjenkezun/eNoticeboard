import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { Announcements } from 'src/app/models/Announcements';
import { CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrService } from 'ngx-toastr';
import { SharingDataService } from 'src/app/shared/sharing-data-service/sharing-data.service';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';

@Component({
  selector: 'app-list-of-user-announcemenets',
  templateUrl: './list-of-user-announcemenets.component.html',
  styleUrls: ['./list-of-user-announcemenets.component.css'],
  providers: [
    Ng2SearchPipeModule
  ]
})
export class ListOfUserAnnouncemenetsComponent implements OnInit, OnDestroy {

  public popoverTitle: string = "Potvrda brisanja";
  public popoverMessage: string = "Da li želite da obrišete izabrano obavještenje?";
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  public selectedAnnouncement = {} as AnnouncementDetails;
  //public filter: CompositeFilterDescriptor;

  public listOfUserAnnouncements = [] as Announcements[];
  
  //With model AnnouncementDetails
  //public listOfUserAnnouncements = [] as AnnouncementDetails[];

  public searchText: string = null;
  public p: number = 1;
  public itmsPerPage: number = 5;

  constructor(private _announcementService: AnnouncementService, 
              private toastr: ToastrService,
              private _sharingDataService: SharingDataService) { }

  ngOnInit(): void {
    this.loadAllAnnouncement();

    this._sharingDataService.currentAnnouncement.subscribe(data => {
      this.listOfUserAnnouncements.push(data)
    });
  }

  ngOnDestroy(): void {
    //UNSUBSCRIBE
  }
  
  public loadAllAnnouncement(): void {

    this._announcementService.getAnnouncements().subscribe(data => {
      this.listOfUserAnnouncements = data;
      console.log(data);
    });
    //With model AnnoucementDetails
    /*this._announcementService.getAnnouncementDetails().subscribe(data => {
      this.listOfUserAnnouncements = data;
      console.log(data);
    });*/
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    //this.filter = filter;
    //this.listOfUserAnnouncements = filterBy(this.listOfUserAnnouncements, filter);
  }

  /*public RowSelected(row: any): void
  {
    this.selectedAnnouncement = row;
    console.log(this.selectedAnnouncement);
  }*/
  
  public updateAnnouncement(row: any): void
  {
    console.log(row);
    console.log(row.announcementId);
    console.log("Announcement UPDATED!");
  }

  public deleteAnnouncement(row: any): void
  {
    if(window.confirm("Da li želite da izbrišete selektovano obavještenje?")){
      this.selectedAnnouncement = row;
      console.log(row.announcementId);
      this._announcementService.deleteAnnouncement(this.selectedAnnouncement.announcementId).subscribe(
        (res: any) => {
          if(res.succeeded){
            this.toastr.success('Obavještenje obrisano');
            console.log("Obavještenje obrisano");
          }
          this.loadAllAnnouncement();
        },
        err => {
          this.toastr.error('Obavještenje nije obrisano', err);
          console.log(err);
        }
      );

      this.selectedAnnouncement = null;
    }
    else{}
  }
}
