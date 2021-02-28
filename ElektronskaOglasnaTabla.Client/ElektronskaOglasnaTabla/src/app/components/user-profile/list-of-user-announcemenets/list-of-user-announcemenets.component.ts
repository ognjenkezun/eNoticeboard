import { Component, OnInit, OnDestroy, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrService } from 'ngx-toastr';
import { SharingDataService } from 'src/app/shared/sharing-data-service/sharing-data.service';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { Categories } from 'src/app/models/Categories';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/file-service/file.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SignalRService } from 'src/app/services/signal-r/signal-r.service';
import { Files } from 'src/app/models/Files';
import { AppConfig } from 'src/app/models/AppConfig';
import { DeleteAnnouncementWS } from 'src/app/models/DeleteAnnouncementWS';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';

@Component({
    selector: 'app-list-of-user-announcemenets',
    templateUrl: './list-of-user-announcemenets.component.html',
    styleUrls: ['./list-of-user-announcemenets.component.css'],
    providers: [
      Ng2SearchPipeModule
    ]
})
export class ListOfUserAnnouncemenetsComponent implements OnInit {

    public listOfImages: string[] = [];
    public files = [] as Files[];
    public appConfig = {} as AppConfig;

    modalRefAdd: BsModalRef;
    modalRefUpdate: BsModalRef;
    
    public importantIndicatorToNumber: number;
    public importantIndicator: boolean;
    public currentDate: Date;
    public listOfCategories = [] as Categories[];

    public listOfFiles: string[];
    public listOfFilesName: {id: number, fileName: string}[] = [];
    public ann = {} as AnnouncementDetails;

    public selectedAnnouncement = {} as AnnouncementDetails;

    public listOfAllAnnouncements = [] as AnnouncementDetails[];

    public searchText: string = "";

    public selectedPage: number = 1;
    public itmsPerPage: number = 5;
    public totalAnnItems: number;

    public modalShow = false;

    constructor(public _announcementService: AnnouncementService, 
                private _toastr: ToastrService,
                private _appConfigService: ConfigurationService,
                private _categoryService: CategoryService,
                private _fileService: FileService,
                private _signalRService: SignalRService,
                private _router: Router,
                private _modalService: BsModalService) { }

    ngOnInit(): void {
        this.currentDate = new Date();
        this.loadAllUserAnnouncements();
        this.listOfFiles = [];
        this.listOfFilesName = [];
        this._announcementService.announcementForm.reset();
        this._modalService.onHide.subscribe(() => {
            this._announcementService.announcementForm.reset();
        });

        this.loadCategories();
    }

    loadConfig(): void {
        this._appConfigService.getConfigData(1).subscribe(data => {
            this.appConfig = data;
        });
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
        this.listOfFilesName = [];
        this.files = [];
    }

    openModalUpdate(template: TemplateRef<any>, row: any) {
        this.modalRefUpdate = this._modalService.show(
            template,
            Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' })
        );
        console.log("ROW FROM openModalUpdate method => ", row);
        
        this._announcementService.getAnnouncementDetails(row.announcementId).subscribe(data => {
            this.fillFields(data);
        });
    }

    closeModalUpdate() {
        this.modalRefUpdate.hide();
        this.listOfFilesName = [];
        this.files = [];
    }

    public loadAllUserAnnouncements(): void {
        this.loadConfig();
        this._announcementService.getSearchedAnnouncementsForAdmin(this.searchText, this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listOfAllAnnouncements = data['result'];
            this.totalAnnItems = data['numberOfAnnouncement'];
            let currentTime = Date.now();
            this.listOfAllAnnouncements.forEach(announcement => {
                let dateCreated = Date.parse(announcement.announcementDateCreated.toString());
                let differenceInMillicecondsCreated = currentTime - dateCreated;
                let hoursCreated = (differenceInMillicecondsCreated / (1000 * 60 * 60));

                if (announcement.announcementDateModified != null) {
                    let dateModified = Date.parse(announcement.announcementDateModified.toString());
                    let differenceInMillicecondsModified = currentTime - dateModified;
                    var hoursModified = (differenceInMillicecondsModified / (1000 * 60 * 60)) || 0;
                }

                if (Math.abs(hoursCreated) < (this.appConfig.announcementExpiry * 24) ||
                    Math.abs(hoursModified) < (this.appConfig.announcementExpiry * 24)) {
                    announcement.isNew = true;
                }
                announcement.announcementDescription = this.convertStringWithHtmlTagsToText(announcement.announcementDescription);
            });
        });
    }

    public onUpdateSubmit(): void {
        if (this._announcementService.announcementForm.get('announcementImportant').value) {
            this.importantIndicatorToNumber = 1;
        }
        else {
            this.importantIndicatorToNumber = 0;
        }

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

                this._signalRService.sendUpdatedAnnouncement(res.updatedAnnouncement);

                this.loadAllUserAnnouncements();
                this.selectedPage = 1;
            },
            err => {
                this._toastr.error(err, 'Izmjena nije uspjela.');
                console.log(err);
            }
        );

        this.ann.announcementTitle = null;
        this.ann.announcementDescription = null;
        this.ann.importantIndicator = null;
        this.ann.categoryId = null;
        this.ann.announcementExpiryDate = null;

        this.selectedAnnouncement = null;
    }

    public onFileDelete(id: number): void {
        console.log("Deleted file with ID => ", id);
    }
    
    public fillFields(announcement: AnnouncementDetails): void {

        this.selectedAnnouncement = announcement;

        if (this.selectedAnnouncement.files) {
            this.selectedAnnouncement.files.forEach(file => {
                this.listOfFilesName.push({ id: file.fileId, fileName: file.filePath.replace(/^.*[\\\/]/, '') });
            });
        }

        this._announcementService.announcementForm.controls['announcementTitle'].setValue(this.selectedAnnouncement.announcementTitle);
        this._announcementService.announcementForm.controls['announcementDescription'].setValue(this.selectedAnnouncement.announcementDescription);
        this._announcementService.announcementForm.controls['announcementImportant'].setValue(this.selectedAnnouncement.importantIndicator);
        this._announcementService.announcementForm.controls['announcementCategory'].setValue(this.selectedAnnouncement.categoryId);
        this._announcementService.announcementForm.controls['announcementExpiryDate'].setValue(new Date(this.selectedAnnouncement.announcementExpiryDate));
 
        console.log("SELECTED ANNOUNCEMENT => ", this.selectedAnnouncement);
        console.log("ROW => ", announcement);
        console.log("FORM DATA => ", this._announcementService.announcementForm);
    }

    debounce() {
        let wordSearch = this.searchText;
        setTimeout(() => {
            if (wordSearch === this.searchText) {
                this.loadAllUserAnnouncements();
            } 
        }, 1000);
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

    returnSelectedAnnonucement(row: any) {
        this.selectedAnnouncement = row;
        console.log(row.announcementId);
    }

    public deleteAnnouncement(): void {
        this._announcementService.deleteAnnouncement(this.selectedAnnouncement.announcementId).subscribe(
            (res: any) => {
                console.log(res);
                
                if (res.succeeded) {
                    this._toastr.success('Obavještenje obrisano');
                    console.log("Obavještenje obrisano");
                }

                let deletedAnnouncementData: DeleteAnnouncementWS = {
                    deletedAnnouncementId: res.announcementId,
                    pageSize: this.appConfig.numberOfLastAnnPerCategory
                };

                this._signalRService.sendDeletedTheLatestAnnouncement(deletedAnnouncementData);

                this.loadAllUserAnnouncements();
                this.selectedPage = 1;
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
            for (let i = 0; i < fileObject["length"]; i ++) {
                let file = {
                    filePath: fileObject[i].name,
                    type: fileObject[i].type
                };
                this.files.push(file);
            }
            console.log("FILES => ", this.files);
            console.log("FILES LENGTH=> ", this.files["length"]);
            for (let i = 0; i < this.files["length"]; i ++) {
                this.listOfFiles.push(this.files[i].filePath);
            }
            
            this._fileService.uploadFiles(event.target.files).subscribe(
                res => {
                    this.listOfFilesName = [];
                }
            );
        }
    }

    onSubmit(): void {
        console.warn(this._announcementService.announcementForm.value);

        if (this._announcementService.announcementForm.get('announcementImportant').value) {
            this.importantIndicatorToNumber = 1;
        }
        else {
            this.importantIndicatorToNumber = 0;
        }

        let announcement = {
            announcementTitle: this._announcementService.announcementForm.get('announcementTitle').value,
            announcementDescription: this._announcementService.announcementForm.get('announcementDescription').value,
            announcementImportantIndicator: this.importantIndicatorToNumber,
            categoryId: this._announcementService.announcementForm.get('announcementCategory').value,
            announcementExpiryDate: this._announcementService.announcementForm.get('announcementExpiryDate').value
        }

        this._announcementService.addAnnouncement(announcement).subscribe(
            (res: any) => {
                for (let i = 0; i < this.files.length; i++) {
                    this.files[i].announcementId = res.announcement.announcementId;
                }

                this._fileService.addFile(this.files).subscribe(data => {
                    console.log("Added file in table Files is => ", data);
                    this.files = [];
                });

                this._toastr.success('Novo obavještenje dodato!', 'Dodavanje uspješno.');
                this._announcementService.announcementForm.reset();
                this.modalRefAdd.hide();
                this.listOfFilesName = [];

                this._signalRService.sendAnnouncement(res.announcement);

                this.loadAllUserAnnouncements();
                this.selectedPage = 1;
            },
            err => {
                this._toastr.error(err, 'Dodavanje nije uspjelo.');
            }
        );
    }

    public convertStringWithHtmlTagsToText(text: string): string {
        let tmp = document.createElement("element");
        tmp.innerHTML = text.replace(/(<([^>]+)>)/gi, " ");
        return tmp.textContent || tmp.innerText || "";
    }
}