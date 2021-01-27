import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { Categories } from 'src/app/models/Categories';
import { Files } from 'src/app/models/Files';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { FileService } from 'src/app/services/file-service/file.service';
import { SharingDataService } from 'src/app/shared/sharing-data-service/sharing-data.service';

@Component({
  selector: 'app-list-of-announcements',
  templateUrl: './list-of-announcements.component.html',
  styleUrls: ['./list-of-announcements.component.css']
})
export class ListOfAnnouncementsComponent implements OnInit {
  
    @ViewChild('inputFile') inputFile: ElementRef;
    public listOfImages: string[] = [];
    public files = [] as Files[];
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

    public listOfUserAnnouncements = [] as AnnouncementDetails[];
    
    //With model AnnouncementDetails
    //public listOfUserAnnouncements = [] as AnnouncementDetails[];

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
                private _router: Router,
                private _modalService: BsModalService) { 

        this.subscribeToEvents();//
    }

    ngOnInit(): void {
        this.currentDate = new Date();
        this.loadAllUserAnnouncements();
        this.listOfFiles = [];
        this.listOfFilesName = [];
        this._sharingDataService.currentAnnouncement.subscribe(data => {
           //this.listOfUserAnnouncements.push(null);
        });
        this._announcementService.announcementForm.reset();
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

    public loadAllUserAnnouncements(): void {

        this._announcementService.getAnnouncementDetailsForUserPerPage(this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listOfUserAnnouncements = data;
            console.log(data);
            this._announcementService.getNumberOfAnnouncementForUser().subscribe(data => {
                this.totalAnnItems = data;
                console.log(this.totalAnnItems)
            });
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
                 //Adding files
                this.files.forEach(item => {
                    item.announcementId = this.selectedAnnouncement.announcementId;
                });

                this._fileService.addFile(this.files).subscribe(data => {
                    console.log("Added file in table Files is => ", data);
                });

                this._toastr.success('Obavještenje uspješno izmijenjeno!', 'Izmjena uspješna.');
                this._announcementService.announcementForm.reset();
                this.modalRefUpdate.hide();
                this.listOfFilesName = [];
                this.loadAllUserAnnouncements();

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

        // if (this._announcementService.announcementForm.get('announcementImportant').value) {
        //     this.importantIndicatorToNumber = 1;
        // }
        // else {
        //     this.importantIndicatorToNumber = 0;
        // }

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

        console.log("SELECTED ANNOUNCEMENT => ", this.selectedAnnouncement);
        console.log("FORM DATA => ", this._announcementService.announcementForm);
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
        this.loadAllUserAnnouncements();
        window.scrollTo(0, 0);
    }

    selectPage(event: any) {
        this.selectedPage = event;
        console.log(event);
        window.scrollTo(0, 0);
        this.loadAllUserAnnouncements();
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
                
                if (res.succeeded) {
                    this._toastr.success('Obavještenje obrisano');
                    console.log("Obavještenje obrisano");
                }
                this.loadAllUserAnnouncements();

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

    public upload(event) {
        if (event.target.files && event.target.files.length > 0) {
            let fileObject = event.target.files;
            for(let i = 0; i < fileObject["length"]; i ++) {
                let file = {
                    filePath: fileObject[i].name,
                    type: fileObject[i].type
                };
                this.files.push(file);
            }
            console.log("FILES => ", this.files);
            console.log("FILES LENGTH=> ", this.files["length"]);
            for(let i = 0; i < this.files["length"]; i ++) {
                this.listOfFiles.push(this.files[i].filePath);
            }
            
            this._fileService.uploadFiles(event.target.files).subscribe(
                res => {
                    //this.inputFile.nativeElement.value = '';
                    this.listOfFiles = [];
                    //this.listOfFilesName = [];
                },
                error => {
                    //this.inputFile.nativeElement.value = '';
                    console.log("Error ", error);
                    
                }
            );
        }
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
                
                //Adding files
                for (let i = 0; i < this.files.length; i++) {
                    this.files[i].announcementId = res.announcementId;
                }

                this._fileService.addFile(this.files).subscribe(data => {
                    console.log("Added file in table Files is => ", data);
                    this.files = [];
                });

                // this._fileService.uploadImages(this.files, res.announcementId).subscribe(
                //     data => {
                //         console.log("DATA => ", data);
                //         this.files = null;
                //         this.listOfImages = null;
                //     },
                //     error => {
                //         this.files = null;
                //         console.log("Error => ", error);
                //     }
                // );

                this._toastr.success('Novo obavještenje dodato!', 'Dodavanje uspješno.');
                this._announcementService.announcementForm.reset();
                this.modalRefAdd.hide();
                this.loadAllUserAnnouncements();
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

    // public upload(event) {
    //     if (event.target.files && event.target.files.length > 0) {
    //         this.files = event.target.files;
    //         console.log("Files => ", this.files);
            
    //         let length = this.files["length"];
    //         for(let i = 0; i < length; i ++) {
    //             this.listOfImages.push(this.files[i].name);
    //             console.log("Type of file => ", this.files[i].type);
    //         }
    //     }
    // }

    private subscribeToEvents(): void {
      
        this._chatService.messageReceived.subscribe((message: string) => {
            console.log(message);
            this.loadAllUserAnnouncements();
        });
    }///
}
