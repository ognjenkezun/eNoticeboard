import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, QueryList, OnDestroy, Inject } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { DOCUMENT } from '@angular/common';
import { FileService } from 'src/app/services/file-service/file.service';
import { PDFDocumentProxy, PDFProgressData } from 'ng2-pdf-viewer';
import { Announcements } from 'src/app/models/Announcements';
import { ChatService } from 'src/app/services/chat-service/chat.service';

@Component({
    selector: 'app-tv-display',
    templateUrl: './tv-display.component.html',
    styleUrls: ['./tv-display.component.css']
})
export class TvDisplayComponent implements OnInit, AfterViewInit, OnDestroy {
    pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    docxSrc ="https://github.com/ognjenkezun/eOglasnaTabla/blob/master/MQTT%20na%20Arduino%20sistemu.pdf";
    @ViewChild('tvContainer') tvContainer: ElementRef;
    //@ViewChild('videoPlayer') videoPlayer: ElementRef;

    public listOfFilesPaths: string[] = [];
    public listOfImagesPaths: string[] = [];

    public duration: number = 180000;
    public numberOfSlideChange: number = 0;
    public numberOfFinishVideo: number = 0;
    
    public arrayOfElements: QueryList<ElementRef>;
    public fullscreenComponent;

    public interval;
    public spinnerCarousel: boolean;
    public announcementsNotExist: boolean;

    public activeSlide: number = 0;

    public counterOfHeight: number = 0;
    public scrollHeight: number = 0;
    public endDetected: boolean = false;

    public listOfAnnouncements: AnnouncementDetails[] = [];

    constructor(private _announcementService: AnnouncementService,
                //private _fileService: FileService,
                private _chatService: ChatService,
                @Inject(DOCUMENT) private document: any) { 

        this.subscribeToEvents();
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
        this.interval = 0;
    }

    ngAfterViewInit(): void {

        console.log(this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children);
        this.fullscreenComponent = this.tvContainer.nativeElement;
    }

    ngOnInit(): void {
        this.spinnerCarousel = true;
        this.announcementsNotExist = false;
        
        this.loadAnnouncements();
        
        // this._fileService.getFiles().subscribe(data => {
        //     this.listOfFilesPaths = data;
        //     //console.log("FILE PATHS => ", data);
        // });

        // this._fileService.getImages().subscribe(data => {
        //     this.listOfImagesPaths = data;
        //     //console.log("IMAGE PATHS => ", data);
        // });
    }

    public loadAnnouncements(): void {
        this._announcementService.getAnnouncementsDetails().subscribe(data => {
            let currentTime = Date.now();
            
            this.listOfAnnouncements = data;
            this.listOfAnnouncements.forEach(announcement => {
                let dateCreated = Date.parse(announcement.announcementDateCreated.toString());
                let differenceInMilliceconds = currentTime - dateCreated;
                let hours = (differenceInMilliceconds/(1000*60*60));

                if(Math.abs(hours) < 24)
                {
                    announcement.isNew = true;
                }
            });

            this.spinnerCarousel = false;

            if(!this.listOfAnnouncements.length){
                this.announcementsNotExist = true;
            }
        }, err => {
            this.spinnerCarousel = false;
            this.announcementsNotExist = true;
        });
    }

    filterFiles(announcement: AnnouncementDetails) {
        if (announcement.files) {
            return announcement.files.filter(file => 
                file.type == "application/pdf"
            );
        }
    }

    filterVideos(announcement: AnnouncementDetails) {
        if (announcement.files) {
            return announcement.files.filter(file => 
                file.type == "video/mp4"
            );
        }
    }

    filterImages(announcement: AnnouncementDetails) {
        if (announcement.files) {
            return announcement.files.filter(file => 
                file.type == "image/png" || "image/jpg" || "image/jpeg"
            );
        }
    }

    // get filterDocuments() {
    //     if (this.announcement.files) {
    //         return this.listOfAnnouncements.filter(announcement => announcement.files.filter(file =>
    //             file.type == "application/pdf"
    //         );
    //     }
    // }

    callBackFn(pdf: PDFDocumentProxy) {
        console.log("(after-load-complete) --> ", pdf);
    }

    onSlideChange(event: any): void {
        //console.log("Video duration is: ", this.videoPlayer.nativeElement.duration);
        // if(this.count < this.listOfAnnouncements.length) {
        //     var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.count].children[0].children[0];
        //     elem.scrollTop = 0;
        //     this.scrollHeight = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.count].children[0].children[0].scrollHeight;
        //     console.log(this.scrollHeight);
            
        //     this.interval = setInterval(() => {
        //         if(this.counterOfHeight < elem.scrollHeight) {
        //             if (this.counterOfHeight == 0) {
        //                 setTimeout(() => {
                            
        //                 }, 5000);
        //             }
        //             this.counterOfHeight += 2;
        //             elem.scrollBy(0, 2);
        //         }
        //         else {
        //             elem.scrollTop = 0;
        //             setTimeout(() => {
        //                 this.counterOfHeight = 0;
        //             }, 5000);
        //         }
        //     }, 50);

        //     this.count ++;
        // }
        // else {
        //     this.onSlideChange();
        //     this.count = 0;
        // }
        
        //console.log("Active slide is event ", event, this.activeSlide);
        clearInterval(this.interval);
        this.interval = 0;
        this.numberOfSlideChange = 0;
        this.counterOfHeight = 0;
        this.numberOfFinishVideo = 0;
        setTimeout(() => {
            if(this.activeSlide < this.listOfAnnouncements.length) {
                var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0];
                elem.scrollTop = 0;
                //console.log("ELEM ============> ", elem);
                
                this.scrollHeight = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0].scrollHeight;
                //console.log(this.scrollHeight);
                
                this.interval = setInterval(() => {
                    if (this.counterOfHeight < elem.scrollHeight) {
                        this.counterOfHeight += 1;
                        elem.scrollBy(0, 1);
                    }
                    else {
                        //this.duration = 1000;
                        //console.log("Slide Height => ", this.counterOfHeight);
                        this.counterOfHeight = 0;
                        this.numberOfSlideChange ++;
                        //console.log("Number of slide changes => ", this.numberOfSlideChange);
                        if (this.numberOfSlideChange == 2 && this.numberOfFinishVideo >= 2) {
                            //console.log("Count => ", this.activeSlide);
                            //Pokusati sa videom i provjeriti
                            this.activeSlide ++;
                            if(this.activeSlide == this.listOfAnnouncements.length) {
                                this.activeSlide = 0;
                            }
                            clearInterval(this.interval);
                            this.interval = 0;
                            this.numberOfSlideChange = 0;
                            this.counterOfHeight = 0;
                        }
                        elem.scrollTop = 0;
                        //////Pokusati
                        setTimeout(() => {
                            console.log("Zastoj 10 sekundi nakon povratka skrola na vrh.");
                        }, 10000);
                    }
                }, 50);
            }
            else {
                this.activeSlide = 0;
            }
        }, 20000);
    }

    onVideoEnded(event): void {
        console.log("Event => ", event);
        console.log("End of video detected!");
        this.numberOfFinishVideo ++;
    }

    pageRendered(e: CustomEvent) {
        console.log("(page-rendered) --> ", e);
    }

    textLayerRendered(e: CustomEvent) {
        console.log("(text-layer-rendered) --> ", e);

        // if(this.activeSlide < this.listOfAnnouncements.length) {
        //     var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0];
        //     elem.scrollTop = 0;
        //     //console.log("ELEM ============> ", elem);
            
        //     this.scrollHeight = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0].scrollHeight;
        //     //console.log(this.scrollHeight);
            
        //     this.interval = setInterval(() => {
        //         if (this.counterOfHeight < elem.scrollHeight) {
        //             this.counterOfHeight += 5;
        //             elem.scrollBy(0, 5);
        //         }
        //         else {
        //             //this.duration = 1000;
        //             //console.log("Slide Height => ", this.counterOfHeight);
        //             this.counterOfHeight = 0;
        //             this.numberOfSlideChange ++;
        //             //console.log("Number of slide changes => ", this.numberOfSlideChange);
        //             if (this.numberOfSlideChange == 2) {
        //                 //console.log("Count => ", this.activeSlide);
        //                 this.activeSlide ++;
        //                 if(this.activeSlide == this.listOfAnnouncements.length) {
        //                     this.activeSlide = 0;
        //                 }
        //                 clearInterval(this.interval);
        //                 this.interval = 0;
        //                 this.numberOfSlideChange = 0;
        //                 this.counterOfHeight = 0;
        //             }
        //             elem.scrollTop = 0;
        //         }
        //     }, 50);
        // }
        // else {
        //     this.activeSlide = 0;
        // }
    }

    onProgress(progressData: PDFProgressData) {
        console.log("(on-progress) --> ", progressData);
    }

    openFullscreen(){
        if(this.fullscreenComponent.requestFullscreen){
            this.fullscreenComponent.requestFullscreen();
        }
        else if(this.fullscreenComponent.webkitRequestFullscreen){
            this.fullscreenComponent.webkitRequestFullscreen();
        }
        else if(this.fullscreenComponent.msRequestFullscreen){
            this.fullscreenComponent.msRequestFullscreen();
        }
        else if(this.fullscreenComponent.mozRequestFullScreen){
            this.fullscreenComponent.mozRequestFullScreen();
        }
    }

    closeFullscreen(){
        if(this.document.exitFullscreen){
            this.document.exitFullscreen();
        }
        else if(this.document.webkitExitFullscreen){
            this.document.webkitExitFullscreen();
        }
        else if(this.document.mozCancelFullScreen){
            this.document.mozCancelFullScreen();
        }
        else if(this.document.msExitFullscreen){
            this.document.msExitFullscreen();
        }
    }

    private subscribeToEvents(): void {

        this._chatService.messageReceived.subscribe((message: string) => {
            console.log(message);
            this.loadAnnouncements();
        });
    }
}
