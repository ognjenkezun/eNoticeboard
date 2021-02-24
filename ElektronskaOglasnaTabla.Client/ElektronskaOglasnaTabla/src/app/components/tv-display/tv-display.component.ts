import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, QueryList, OnDestroy, Inject, Input } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { DOCUMENT } from '@angular/common';
import { PDFDocumentProxy, PDFProgressData } from 'ng2-pdf-viewer';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';
import { AppConfig } from 'src/app/models/AppConfig';
import { SignalRService } from 'src/app/services/signal-r/signal-r.service';
import { ToastrService } from 'ngx-toastr';
import { config } from 'rxjs';

@Component({
    selector: 'app-tv-display',
    templateUrl: './tv-display.component.html',
    styleUrls: ['./tv-display.component.css']
})
export class TvDisplayComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('tvContainer', {read: ElementRef, static: false}) tvContainer: ElementRef;

    public listOfAnnouncements: Array<AnnouncementDetails> = [];

    public listOfFilesPaths: string[] = [];
    public listOfImagesPaths: string[] = [];

    public configApp = {} as AppConfig;

    public duration: number = 30000;
    public numberOfSlideChange: number = 0;
    public numberOfFinishVideo: number = 0;
    
    public fullscreenComponent;

    public listOfMockAnnouncement = [];

    public interval;
    public automaticallyUpdateInterval;
    public timeForAutomaticallyUpdate: number;
    public spinnerCarousel: boolean;
    public announcementsNotExist: boolean;

    public activeSlide: number = 0;

    public counterOfHeight: number = 0;
    public scrollHeight: number = 0;
    public endDetected: boolean = false;

    constructor(private _announcementService: AnnouncementService,
                private _configService: ConfigurationService,
                private _signalRService: SignalRService,
                private _toastr: ToastrService,
                @Inject(DOCUMENT) private document: any) { 

        this.subscribeToEvents();
    }

    ngOnInit(): void {
        this.spinnerCarousel = true;
        this.announcementsNotExist = false;
        
        this.loadConfig();

        this.timeForAutomaticallyUpdate = (this.configApp.automaticallyUpdate * 1000) || 3600000;
        
        this.automaticallyUpdateInterval = setInterval(() => {
            this.loadConfig();
        }, this.timeForAutomaticallyUpdate);

        this.duration = 0;
    }

    ngAfterViewInit(): void {
        this.fullscreenComponent = this.tvContainer.nativeElement;
        console.log("After view init => ", this.tvContainer);
    }
    
    ngOnDestroy(): void {
        clearInterval(this.interval);
        this.interval = 0;
        clearInterval(this.automaticallyUpdateInterval);
        this.automaticallyUpdateInterval = 0;
    }

    public loadAnnouncements(configApp: AppConfig): void {
        this._announcementService.getAnnouncementsDetails().subscribe(data => {
            this.listOfAnnouncements = [];
            this.listOfAnnouncements = data;
            this.listOfAnnouncements.forEach(announcement => {
                announcement.isNew = this.isNew(announcement, configApp);
            });

            this.spinnerCarousel = false;
            this.activeSlide = 0;

            if (!this.listOfAnnouncements.length) {
                this.announcementsNotExist = true;
            }
        }, err => {
            this.spinnerCarousel = false;
            this.announcementsNotExist = true;
        });
    }

    public loadConfig(): void {
        this._configService.getConfigData(1).subscribe(data => {
            let configApp = data;
            this.duration = (configApp.slideDurationOnTv * 1000) || 30000;

            this.loadAnnouncements(configApp);
        });
    }

    onSlideChangeeee(activeSlide: number): void {
        clearInterval(this.interval);
        this.interval = 0;
        let numberOfSlideChange = 0;
        let counterOfHeight = 0;
        
        console.log("Pauza 5 sekundi");
        var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[activeSlide].children[0].children[0].children[0].children[0];
        elem.scrollTop = 0;
        let scrollHeight: number = elem.scrollHeight;
        console.log("Scroll height => ", scrollHeight);
        let offsetHeight: number = elem.offsetHeight;
        console.log("Offset height => ", offsetHeight);

        setTimeout(() => {
            console.log("Pauza zavrsena");
            
            if (activeSlide < this.listOfAnnouncements.length) {
                this.interval = setInterval(() => {
                    if (scrollHeight > counterOfHeight) {
                        counterOfHeight += 1;
                        console.log(`CounterOfHeight => ${counterOfHeight}, OffsetHeight ${offsetHeight}, ScrollHeight ${scrollHeight}`);
                        if (counterOfHeight > offsetHeight) {
                            elem.scrollBy(0, 1);
                        }
                    }
                    else {
                        counterOfHeight = 0;
                        numberOfSlideChange ++;
                        if (numberOfSlideChange == 1) {
                            clearInterval(this.interval);
                            console.log("Skrolanje zavrseno");
                            console.log("Aktivni slajd", activeSlide + 1);

                            this.interval = 0;
                            numberOfSlideChange = 0;
                            counterOfHeight = 0;

                            console.log("Pauza 5 sekundi");
                            setTimeout(() => {
                                if (activeSlide == this.listOfAnnouncements.length) {
                                    this.activeSlide = 0;
                                }
                                else {
                                    this.activeSlide ++;
                                }
                            }, 5000);
                        }
                    }
                }, 50);
            }
            else {
                this.activeSlide = 0;
            }
        }, 5000);
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
                file.type.includes("video")
            );
        }
    }

    filterImages(announcement: AnnouncementDetails) {
        if (announcement.files) {
            return announcement.files.filter(file =>
                file.type.includes("image")
            );
        }
    }

    onSlideChange(event: any): void {
        console.log("This outside => ", this.tvContainer);
        console.log("ACTIVE SLIDE => ", this.activeSlide);
        console.log("ACTIVE SLIDE (AS EVENT) => ", this.activeSlide);
         
        //if (this._afterViewInitExecuted) {
        var elem: any;
        setTimeout(() => {
            elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0];
            elem.scrollTop = 0;
        }, 0);

        if(this.duration > 0) {
            setTimeout(() => {
                clearInterval(this.interval);
                this.interval = 0;
                let scrollSpeed = 0;
                this.counterOfHeight = 0;
                
                //var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0];
                //elem.scrollTop = 0;
                
                this.scrollHeight = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0].scrollHeight;
                scrollSpeed = +((this.scrollHeight / (this.duration - 10000)) * 50);
                
                this.interval = setInterval(() => {
                    if (this.counterOfHeight < elem.scrollHeight) {
                        this.counterOfHeight += scrollSpeed;
                        elem.scrollBy(0, scrollSpeed);
                    }
                    else {
                        this.counterOfHeight = 0;
                        elem.scrollTop = 0;
                        clearInterval(this.interval);
                        this.interval = 0;
                    }
                }, 50);
            }, 10000);
        }
        else if (this.duration === 0) {
            setTimeout(() => {
                clearInterval(this.interval);
                this.interval = 0;
                let scrollSpeed = 0;
                //this.duration = 5000;
                this.numberOfSlideChange = 0;
                this.counterOfHeight = 0;
                
                // var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0];
                // elem.scrollTop = 0;
                
                this.scrollHeight = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0].scrollHeight;
                console.log(this.scrollHeight);
                scrollSpeed = +((this.scrollHeight / this.duration) * 100);
                
                this.interval = setInterval(() => {
                    if (this.counterOfHeight < elem.scrollHeight) {
                        //this.counterOfHeight += scrollSpeed;
                        this.counterOfHeight += 5;
                        elem.scrollBy(0, 5);
                        //elem.scrollBy(0, 1);
                    }
                    else {
                        this.counterOfHeight = 0;
                        this.numberOfSlideChange ++;
                        console.log("Number of slide changes => ", this.numberOfSlideChange);
                        if (this.numberOfSlideChange == 2) {
                            console.log("Count => ", this.activeSlide);
                            if (this.activeSlide === (this.listOfAnnouncements.length - 1))
                                this.activeSlide = 0;
                            else
                                this.activeSlide ++;
                            this.numberOfSlideChange = 0;
                        }
                        elem.scrollTop = 0;
                        //////Pokusati
                        // setTimeout(() => {
                        //     console.log("Zastoj 10 sekundi nakon povratka skrola na vrh.");
                        // }, 10000);
                    }
                }, 50);
                console.log("Zastoj 10 sekundi nakon povratka skrola na vrh.");
            }, 10000);
        }
    }


    openFullscreen() {
        if (this.fullscreenComponent.requestFullscreen) {
            this.fullscreenComponent.requestFullscreen();
        }
        else if (this.fullscreenComponent.webkitRequestFullscreen) {
            this.fullscreenComponent.webkitRequestFullscreen();
        }
        else if (this.fullscreenComponent.msRequestFullscreen) {
            this.fullscreenComponent.msRequestFullscreen();
        }
        else if (this.fullscreenComponent.mozRequestFullScreen) {
            this.fullscreenComponent.mozRequestFullScreen();
        }
    }

    closeFullscreen() {
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        }
        else if (this.document.webkitExitFullscreen) {
            this.document.webkitExitFullscreen();
        }
        else if (this.document.mozCancelFullScreen) {
            this.document.mozCancelFullScreen();
        }
        else if (this.document.msExitFullscreen) {
            this.document.msExitFullscreen();
        }
    }

    public isNew(announcement: AnnouncementDetails, configApp: AppConfig): boolean {
        let currentTime = Date.now();
        
        let dateCreated = Date.parse(announcement.announcementDateCreated.toString());
        let differenceInMillicecondsCreated = currentTime - dateCreated;
        let hoursCreated = (differenceInMillicecondsCreated / (1000 * 60 * 60));

        if (announcement.announcementDateModified != null) {
            let dateModified = Date.parse(announcement.announcementDateModified.toString());
            let differenceInMillicecondsModified = currentTime - dateModified;
            var hoursModified = (differenceInMillicecondsModified / (1000 * 60 * 60)) || 0;
        }

        if (Math.abs(hoursCreated) < (configApp.announcementExpiry * 24) ||
            Math.abs(hoursModified) < (configApp.announcementExpiry * 24)) {
                return true;
        }
        else {
            return false;
        }
    }

    private subscribeToEvents(): void {
        this._signalRService.newAnnouncementRecieved.subscribe((newAnnouncement: AnnouncementDetails) => {
            this._toastr.success(`Dodato novo obavještenje "${newAnnouncement.announcementTitle}"!`, 'Dodavanje uspješno.');
            this.loadConfig();
        });

        this._signalRService.updatedAnnouncementRecieved.subscribe((updatedAnnouncement: AnnouncementDetails) => {
            this._toastr.success(`Obavještenje "${updatedAnnouncement.announcementTitle}" modifikovano!`, 'Modofikovanje uspješno.');
            this.loadConfig();
        });

        this._signalRService.nextAnnouncementFromCategoryRecieved.subscribe((deletedAnnouncementId: number) => {
            this._toastr.success(`Obavještenje "${this.listOfAnnouncements[deletedAnnouncementId].announcementTitle}" izbrisano!`, 'Brisanje uspješno.');
            this.loadConfig();
        });
    }
}
