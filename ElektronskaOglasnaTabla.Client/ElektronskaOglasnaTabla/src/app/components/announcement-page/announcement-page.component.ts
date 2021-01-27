import { Component, OnInit, Input } from '@angular/core';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { FileService } from 'src/app/services/file-service/file.service';
import { ChatService } from 'src/app/services/chat-service/chat.service';

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

    public announcement = {} as AnnouncementDetails;
    public listAnnouncements = [] as AnnouncementDetails[];
    public annFromSameCategory = [] as AnnouncementDetails[];
    public catId: number;

    constructor(private _announcementService: AnnouncementService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _chatService: ChatService,
                private _fileService: FileService) { 
        
        this.subscribeToEvents();
    }

    ngOnInit(): void {
        this.listOfFiles = [];
        let id = +this._route.snapshot.params['id'];
        this._announcementService.getAnnouncementDetails(id).subscribe(data => {
            this.announcement = data;

            if (this.announcement.files.length > 0) {
                this.announcement.files.forEach(file => {
                    this.listOfFiles.push(file.filePath.replace(/^.*[\\\/]/, ''));
                    console.log("File is => ", file);
                });
            }

            let currentTime = Date.now();
            let dateCreated = Date.parse(this.announcement.announcementDateCreated.toString());
            let differenceInMilliceconds = currentTime - dateCreated;
            let hours = (differenceInMilliceconds/(1000*60*60));

            if(Math.abs(hours) < 24)
            {
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

    get filterFiles() {
        if (this.announcement.files) {
            return this.announcement.files.filter(file => 
                file.type == "video/mp4"
            );
        }
    }

    get filterImages() {
        if (this.announcement.files) {
            return this.announcement.files.filter(file => 
                file.type == "image/png" || "image/jpg" || "image/jpeg"
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
            this.annFromSameCategory = data;
            console.log(data);
        });
    }

    loadAnnonucements(): void {
        this._announcementService.getAnnouncementsDetails().subscribe(data => {
            this.listAnnouncements = data;
        });
    }

    private subscribeToEvents(): void {

        this._chatService.messageReceived.subscribe((message: string) => {
            console.log(message);
            this.loadFromSameCategory(this.announcement.categoryId, this.announcement.announcementId);
        });
    }
}
