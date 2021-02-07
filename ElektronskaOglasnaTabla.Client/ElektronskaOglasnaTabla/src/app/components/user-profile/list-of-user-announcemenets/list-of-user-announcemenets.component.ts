import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { Announcements } from 'src/app/models/Announcements';
import { CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrService } from 'ngx-toastr';
import { SharingDataService } from 'src/app/shared/sharing-data-service/sharing-data.service';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { Categories } from 'src/app/models/Categories';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { FileService } from 'src/app/services/file-service/file.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SignalRService } from 'src/app/services/signal-r/signal-r.service';

@Component({
    selector: 'app-list-of-user-announcemenets',
    templateUrl: './list-of-user-announcemenets.component.html',
    styleUrls: ['./list-of-user-announcemenets.component.css'],
    providers: [
      Ng2SearchPipeModule
    ]
})
export class ListOfUserAnnouncemenetsComponent implements OnInit, OnDestroy {

    public confirmClicked: boolean = false;
    public cancelClicked: boolean = false;

    modalRefAdd: BsModalRef;
    modalRefUpdate: BsModalRef;
    
    public importantIndicatorToNumber: number;
    public importantIndicator: boolean;
    public currentDate: Date;
    public listOfCategories = [] as Categories[];

    public listOfFiles: string[];
    public listOfFilesName: string[];

    public selectedAnnouncement = {} as AnnouncementDetails;
    //public filter: CompositeFilterDescriptor;

    public listOfAllAnnouncements = [] as AnnouncementDetails[];
    
    //With model AnnouncementDetails
    //public listOfAllAnnouncements = [] as AnnouncementDetails[];

    public searchText: string = null;

    public selectedPage: number = 1;
    public itmsPerPage: number = 5;
    public totalAnnItems: number;

    public modalShow = false;

    constructor(public _announcementService: AnnouncementService, 
                private _toastr: ToastrService,
                private _sharingDataService: SharingDataService,
                private _categoryService: CategoryService,
                private _chatService: ChatService,
                private _fileService: FileService,
                private _signalRService: SignalRService,
                private _router: Router,
                private _modalService: BsModalService) { 

        this.subscribeToEvents();//
    }

    ngOnInit(): void {
        this.currentDate = new Date();
        this.loadAllAnnouncement();
        this.listOfFiles = [];
        this.listOfFilesName = [];
        this._sharingDataService.currentAnnouncement.subscribe(data => {
           //this.listOfAllAnnouncements.push(null);
        });

        this._modalService.onHide.subscribe(() => {
            this._announcementService.announcementForm.reset();
        });

        this.loadCategories();
    }

    loadCategories(): void {
        this._categoryService.getCategories().subscribe(data => {
            this.listOfCategories = data;
        });
    }

    ngOnDestroy(): void {
      //UNSUBSCRIBE
    }

    openModalAdd(template: TemplateRef<any>) {
        this.modalRefAdd = this._modalService.show(
            template,
            Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' })
        );
    }

    closeModalAdd() {
        this.modalRefAdd.hide();
    }

    openModalUpdate(template: TemplateRef<any>, row: any) {
        this.modalRefUpdate = this._modalService.show(
            template,
            Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' })
        );

        this.fillFields(row);
    }

    closeModalUpdate() {
        this.modalRefUpdate.hide();
        this.listOfFilesName = [];
    }

    public loadAllAnnouncement(): void {

        this._announcementService.getAnnouncementsDetailsPage(this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listOfAllAnnouncements = data;
            let tmp = document.createElement("element");
            this.listOfAllAnnouncements.forEach(announcement => {
                tmp.innerHTML = announcement.announcementDescription;
                announcement.announcementDescription = tmp.textContent || tmp.innerText || "";
            });
            console.log(data);
            this._announcementService.getNumberOfAnnouncement().subscribe(data => {
                this.totalAnnItems = data;
                console.log(this.totalAnnItems)
            });
        });

      //With model AnnoucementDetails
      /*this._announcementService.getAnnouncementDetails().subscribe(data => {
        this.listOfAllAnnouncements = data;
        console.log(data);
      });*/
    }

    public filterChange(filter: CompositeFilterDescriptor): void {
      //this.filter = filter;
      //this.listOfAllAnnouncements = filterBy(this.listOfAllAnnouncements, filter);
    }

    /*public RowSelected(row: any): void
    {
      this.selectedAnnouncement = row;
      console.log(this.selectedAnnouncement);
    }*/

    public onUpdateSubmit(row: any): void {
        console.log(row);
        console.log(row.announcementId);
        console.log("Announcement UPDATED!");

        this.selectedAnnouncement = row;
        console.log(this.selectedAnnouncement);

        if (this._announcementService.announcementForm.get('announcementImportant').value) {
            this.importantIndicatorToNumber = 1;
        }
        else {
            this.importantIndicatorToNumber = 0;
        }

        console.log("ANN ID => ", this.selectedAnnouncement.announcementId);
        console.log("USER ID => ", this.selectedAnnouncement.userCreatedId);
        let updatedAnnouncement = {
            announcementId: this.selectedAnnouncement.announcementId,
            announcementTitle: this._announcementService.announcementForm.get('announcementTitle').value,
            announcementDescription: this._announcementService.announcementForm.get('announcementDescription').value,
            announcementDateCreated: this.selectedAnnouncement.announcementDateCreated,
            announcementImportantIndicator: this.importantIndicatorToNumber,
            userCreatedId: this.selectedAnnouncement.userCreatedId,
            categoryId: this._announcementService.announcementForm.get('announcementCategory').value,
            announcementExpiryDate: this._announcementService.announcementForm.get('announcementExpiryDate').value
        }

        this._announcementService.editAnnouncement(updatedAnnouncement.announcementId, updatedAnnouncement).subscribe(
            (res: any) => {
                this._toastr.success('Obavještenje uspješno izmijenjeno!', 'Izmjena uspješna.');
                this._announcementService.announcementForm.reset();
                this.modalRefUpdate.hide();
                this.loadAllAnnouncement();
                this.listOfFilesName = [];

                let mes = "Message sent!";
                this._chatService.sendMessage(mes);
            },
            err => {
                this._toastr.error(err, 'Izmjena nije uspjela.');
                console.log(err);
            }
        );
        this.selectedAnnouncement = null;
    }
    
    public fillFields(row: any): void
    {
        //let dateAndTimeModified: Date = new Date();
        //let token = localStorage.getItem('token');
        //let currentUser = jwt_decode(token);
        //console.log(currentUser);

        console.log(row);
        console.log(row.announcementId);
        console.log("Announcement UPDATED!");

        this.selectedAnnouncement = row;
        console.log(this.selectedAnnouncement);
        if (this.selectedAnnouncement.files) {
            this.selectedAnnouncement.files.forEach(file => {
                this.listOfFilesName.push(file.filePath.replace(/^.*[\\\/]/, ''));
                console.log("File is => ", file);
            });
        }

        this._announcementService.announcementForm.controls['announcementTitle'].setValue(this.selectedAnnouncement.announcementTitle);
        this._announcementService.announcementForm.controls['announcementDescription'].setValue(this.selectedAnnouncement.announcementDescription);
        this._announcementService.announcementForm.controls['announcementImportant'].setValue(this.selectedAnnouncement.importantIndicator);
        this._announcementService.announcementForm.controls['announcementCategory'].setValue(this.selectedAnnouncement.categoryId);
        this._announcementService.announcementForm.controls['announcementExpiryDate'].setValue(new Date(this.selectedAnnouncement.announcementExpiryDate));
        
        // if(this._announcementService.announcementForm.get('announcementImportant').value){
        //     this.importantIndicatorToNumber = 1;
        // }
        // else{
        //     this.importantIndicatorToNumber = 0;
        // }

        console.log("ANN ID => ", this.selectedAnnouncement.announcementId);
        console.log("USER ID => ", this.selectedAnnouncement.userCreatedId);
        // let updatedAnnouncement = {
        //     announcementId: this.selectedAnnouncement.announcementId,
        //     announcementTitle: this._announcementService.announcementForm.get('announcementTitle').value,
        //     announcementDescription: this._announcementService.announcementForm.get('announcementDescription').value,
        //     announcementDateCreated: this.selectedAnnouncement.announcementDateCreated,
        //     announcementImportantIndicator: this.importantIndicatorToNumber,
        //     userCreatedId: this.selectedAnnouncement.userCreatedId,
        //     categoryId: this._announcementService.announcementForm.get('announcementCategory').value,
        //     announcementExpiryDate: this._announcementService.announcementForm.get('announcementExpiryDate').value
        // }

        // this._announcementService.editAnnouncement(updatedAnnouncement.announcementId, updatedAnnouncement).subscribe();
        

        // let mes = "Message sent!";
        // this.chatService.sendMessage(mes);
    }

    onClick(announcementId: number): void {
        this._router.navigate(['/announcement', announcementId]);
        window.scrollTo(0, 0);
    }

    onItemsPerPageChange(): void {
        this.selectedPage = 1;
        this.loadAllAnnouncement();
        window.scrollTo(0, 0);
    }

    selectPage(event: any) {
        this.selectedPage = event;
        console.log(event);
        window.scrollTo(0, 0);
        this.loadAllAnnouncement();
    }

    loadAllAnnouncementsDetailsPerPage() {
        //this._announcementService.getAnnouncementFromCategory(this.selectedCategory.categoryId, this.selectedPage, this.itmsPerPage).subscribe(data => {
            //this.listAnnouncements = data;
            //console.log(this.listAnnouncements);
            // this._announcementService.getNumberOgAnnouncementFromCategory(this.selectedCategory.categoryId).subscribe(data => {
            //     this.totalAnnItems = data;
            //     console.log(this.totalAnnItems)
            // });
        //});
    }

    returnSelectedAnnonucement(row: any){
        this.selectedAnnouncement = row;
        console.log(row.announcementId);
    }

    public deleteAnnouncement(): void
    {
        this._announcementService.deleteAnnouncement(this.selectedAnnouncement.announcementId).subscribe(
            (res: any) => {
                console.log(res);
                
                if(res.succeeded){
                    this._toastr.success('Obavještenje obrisano');
                    console.log("Obavještenje obrisano");
                }
                this.loadAllAnnouncement();

                let mes = "Message sent!";
                this._chatService.sendMessage(mes);
            },
            err => {
                this._toastr.error('Obavještenje nije obrisano', err);
                console.log(err);
            }
        );
        this.selectedAnnouncement = null;

        this.modalShow = false;
    }

    onSubmit(): void {
        // let currentDateAndTime: Date = new Date();
        // let dateTimeNow = new Date();
        //dateFormat(dateTimeNow, "dd.mm.yyyy. HH:MM:ss");
        console.log("ADD button clicked");
        console.warn(this._announcementService.announcementForm.value);
        //let token = localStorage.getItem('token');
        //let currentUser = jwt_decode(token);
        //console.log(currentUser);

        if(this._announcementService.announcementForm.get('announcementImportant').value){
            this.importantIndicatorToNumber = 1;
        }
        else{
            this.importantIndicatorToNumber = 0;
        }

        let announcement = {
            announcementTitle: this._announcementService.announcementForm.get('announcementTitle').value,
            announcementDescription: this._announcementService.announcementForm.get('announcementDescription').value,
            announcementImportantIndicator: this.importantIndicatorToNumber,
            categoryId: this._announcementService.announcementForm.get('announcementCategory').value,
            announcementExpiryDate: this._announcementService.announcementForm.get('announcementExpiryDate').value,
            announcementShow: true
        }

        console.log(announcement);

        //this._sharingDataService.changeAnnouncement(announcementAA);

        this._announcementService.addAnnouncement(announcement).subscribe(
            (res: any) => {
                console.log("POST DATA => ", res);
                
                this._toastr.success('Novo obavještenje dodato!', 'Dodavanje uspješno.');
                this._announcementService.announcementForm.reset();
                this.modalRefAdd.hide();
                this.loadAllAnnouncement();
                this.listOfFilesName = [];

                let mes = "Message sent!";
                this._chatService.sendMessage(mes);
            },
            err => {
                this._toastr.error(err, 'Dodavanje nije uspjelo.');
                console.log(err);
            }
        );
    }

    public convertStringWithHtmlTagsToText(text: string): string {
        let tmp = document.createElement("element");
        tmp.innerHTML = text;
        return tmp.textContent || tmp.innerText || "";
    }

    private subscribeToEvents(): void {
        this._chatService.messageReceived.subscribe((message: string) => {
            console.log(message);
            this.loadAllAnnouncement();
        });

        this._signalRService.announcementRecieved.subscribe((newAnnouncement: AnnouncementDetails) => {
            console.warn("ADDED SIGNAL R ANNOUNCEMENT IS => ", newAnnouncement);

            newAnnouncement.announcementDescription = this.convertStringWithHtmlTagsToText(newAnnouncement.announcementDescription);

            this.listOfAllAnnouncements.push(newAnnouncement);
            this.listOfAllAnnouncements.sort((x, y) => {
                // if (Date.parse(x.announcementDateCreated.toString()) > Date.parse(y.announcementDateCreated.toString())) {
                //     return 1;
                // }
                // if (Date.parse(x.announcementDateCreated.toString()) < Date.parse(y.announcementDateCreated.toString())) {
                //     return -1;
                // }
                // return 0;

                //POKUSATI
                //x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated
                let a = Date.parse(x.announcementDateCreated.toString());
                let b = Date.parse(y.announcementDateCreated.toString());
                    
                return b - a;
            });
            this.listOfAllAnnouncements.pop();
        });

        this._signalRService.updatedAnnouncementRecieved.subscribe((updatedAnnouncement: AnnouncementDetails) => {
            console.warn("UPDATED SIGNAL R ANNOUNCEMENT IS => ", updatedAnnouncement);
            let findedIndex = this.listOfAllAnnouncements.findIndex(announcement => announcement.announcementId === updatedAnnouncement.announcementId);
            this.listOfAllAnnouncements[findedIndex] = updatedAnnouncement;
        });

        this._signalRService.deletedAnnouncementIdRecieved.subscribe((deletedAnnouncementId: number) => {
            let nextAnnounce = {} as AnnouncementDetails;

            let deletedIndex = this.listOfAllAnnouncements.findIndex(announcement => announcement.announcementId === deletedAnnouncementId);
            this.listOfAllAnnouncements.push(nextAnnounce);
            this.listOfAllAnnouncements.splice(deletedIndex, 1);

            nextAnnounce = null;
            //Pozvati u API-u da se izracuna sljedeci najmladji announcemnt i vratiti ga sa ID-om
        });
    }///
}