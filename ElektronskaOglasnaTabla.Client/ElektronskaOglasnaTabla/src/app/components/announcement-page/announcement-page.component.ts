import { Component, OnInit, Input } from '@angular/core';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { FileService } from 'src/app/services/file-service/file.service';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';
import { AppConfig } from 'src/app/models/AppConfig';
import { SignalRService } from 'src/app/services/signal-r/signal-r.service';

@Component({
    selector: 'app-announcement-page',
    templateUrl: './announcement-page.component.html',
    styleUrls: ['./announcement-page.component.css']
})
export class AnnouncementPageComponent implements OnInit {

    //POREDITI VRIJEME, AKO JE U POSLJEDNJA 24 h, ONDA IMA PLAVI BEDŽ NOVO!!!!
    //Postaviti da se samo zadnjih 10 prikazuje u carousel-u
    //Na desnoj strani postaviti 3 iz iste kategorije

    public listOfFilesPaths: string[] = [];
    public listOfImagesPaths: string[] = [];
    public listOfFiles: string[];

    pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

    public configApp = {} as AppConfig;
    public announcement = {} as AnnouncementDetails;
    public announcementFromSameCategory = [] as AnnouncementDetails[];

    constructor(private _announcementService: AnnouncementService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _configService: ConfigurationService,
                private _signalRService: SignalRService,
                private _chatService: ChatService,
                private _fileService: FileService) { 
        
        this.subscribeToEvents();
    }

    ngOnInit(): void {
        this.listOfFiles = [];
        let id = +this._route.snapshot.params['id'];

        this.loadConfig();
        this._announcementService.getAnnouncementDetails(id).subscribe(data => {
            this.announcement = data;

            if (this.announcement.files.length > 0) {
                this.announcement.files.forEach(file => {
                    if (file.type === 'application/pdf') {
                        this.listOfFiles.push(file.filePath.replace(/^.*[\\\/]/, ''));
                        console.log("File is => ", file);
                    }
                });
            }

            let currentTime = Date.now();

            let dateCreated = Date.parse(this.announcement.announcementDateCreated.toString());
            let differenceInMillicecondsCreated = currentTime - dateCreated;
            let hoursCreated = (differenceInMillicecondsCreated / (1000 * 60 * 60));

            if (this.announcement.announcementDateModified != null) {
                let dateModified = Date.parse(this.announcement.announcementDateModified.toString());
                let differenceInMillicecondsModified = currentTime - dateModified;
                var hoursModified = (differenceInMillicecondsModified / (1000 * 60 * 60)) || 0;
            }

            if (Math.abs(hoursCreated) < (this.configApp.announcementExpiry * 24) || 
                Math.abs(hoursModified) < (this.configApp.announcementExpiry * 24)) {
                this.announcement.isNew = true;
            }

            this.loadFromSameCategory(this.announcement.categoryId, this.announcement.announcementId);
        });

        this._router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };

        this._fileService.getFiles().subscribe(data => {
            this.listOfFilesPaths = data;
            console.log("FILE PATHS => ", data);
        });

        this._fileService.getImages().subscribe(data => {
            this.listOfImagesPaths = data;
            console.log("IMAGE PATHS => ", data);
        });

        

        // this.listOfImages.forEach(file => {
        //     this.listOfFiless.push("http://localhost:5000/Resources/Files/" + file);
        // });

        // this.listOfImages.forEach(file => {
        //     this.listOfFiless.push(this.imageBasePath.concat(file));
        //     console.log("FULL PATH => ", this.imageBasePath.concat(file));
        // });
    }

    filterPDFFiles(announcement: AnnouncementDetails) {
        if (announcement.files) {
            return announcement.files.filter(file => 
                file.type == "application/pdf"
            );
        }
    }

    public loadConfig(): void {
        this._configService.getConfigData(1).subscribe(data => {
            this.configApp.announcementExpiry = data.announcementExpiry || 1;
        });
    }

    get filterFiles() {
        if (this.announcement.files) {
            return this.announcement.files.filter(file => 
                file.type.includes("video")
            );
        }
    }

    get filterImages() {
        if (this.announcement.files) {
            return this.announcement.files.filter(file => 
                file.type.includes("image")
            );
        }
    }

    get filterDocuments() {
        if (this.announcement.files) {
            return this.announcement.files.filter(file => 
                file.type == "application/pdf"
            );
        }
    }

    public onCategoryClick(id: number): void {
        this._router.navigate(['categories/', id]);
    }

    onClick(announcementId: number): void {
        this._router.navigate(['/announcement', announcementId]);
        this._router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
        console.log(announcementId);
        window.scrollTo(0, 0);
    }

    loadFromSameCategory(categoryId: number, announcementId: number): void {
        this._announcementService.getFromSameCategory(categoryId, announcementId).subscribe(data => {
            this.announcementFromSameCategory = data;
            console.log(data);
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

    public convertStringWithHtmlTagsToText(text: string): string {
        let tmp = document.createElement("element");
        tmp.innerHTML = text;
        return tmp.textContent || tmp.innerText || "";
    }

    private subscribeToEvents(): void {
        this._chatService.messageReceived.subscribe((message: string) => {
            console.log(message);
            this.loadConfig();
            this.loadFromSameCategory(this.announcement.categoryId, this.announcement.announcementId);
        });

        this._signalRService.newAnnouncementRecieved.subscribe((newAnnouncement: AnnouncementDetails) => {
            console.warn("ADDED SIGNAL R ANNOUNCEMENT IS => ", newAnnouncement);
            
            newAnnouncement.isNew = this.isNew(newAnnouncement);
            newAnnouncement.announcementDescription = this.convertStringWithHtmlTagsToText(newAnnouncement.announcementDescription);
            
            if (this.announcement.categoryId === newAnnouncement.categoryId) {
                this.announcementFromSameCategory.unshift(newAnnouncement);
                this.announcementFromSameCategory.pop();
            }
        });

        this._signalRService.updatedAnnouncementRecieved.subscribe((updatedAnnouncement: AnnouncementDetails) => {
            console.warn("UPDATED SIGNAL R ANNOUNCEMENT IS => ", updatedAnnouncement);

            updatedAnnouncement.isNew = this.isNew(updatedAnnouncement);

            if (this.announcement.announcementId === updatedAnnouncement.announcementId) {
                this.announcement = updatedAnnouncement;
            }

            if (this.announcement.categoryId === updatedAnnouncement.categoryId) {
                let findedIndex = this.announcementFromSameCategory.findIndex(announcement => announcement.announcementId === updatedAnnouncement.announcementId);
                if (findedIndex != -1) {
                    this.announcementFromSameCategory[findedIndex] = updatedAnnouncement;
                }
                else {
                    this.announcementFromSameCategory.unshift(updatedAnnouncement);
                    this.announcementFromSameCategory.pop();
                    //this.listOfTheMostImportantAnnouncements.filter(val => val);
                }
            }

        });
    }
}
