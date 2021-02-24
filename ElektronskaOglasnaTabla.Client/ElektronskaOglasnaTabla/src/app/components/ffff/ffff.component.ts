import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, HostBinding, HostListener, Inject, Input, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { AppConfig } from 'src/app/models/AppConfig';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';

@Component({
  selector: 'app-ffff',
  templateUrl: './ffff.component.html',
  styleUrls: ['./ffff.component.css']
})
export class FfffComponent implements OnInit, AfterViewInit, AfterViewChecked, DoCheck {
    
    @Input() listOfAnnouncements: AnnouncementDetails[] = [];
    @ViewChild('tvContainer') tvContainer: ElementRef;
    
    annDifferMap = new Map<number, any>();
    annMap = new Map<number, AnnouncementDetails>();
    arrayDiffer: any;
    changeLogs: string[] = [];
    
    public configApp = {} as AppConfig;
    public listOfFilesPaths: string[] = [];
    public listOfImagesPaths: string[] = [];

    public duration: number;
    public numberOfSlideChange: number = 0;

    public fullscreenComponent;

    public interval;
    public automaticallyUpdateInterval;
    public timeForAutomaticallyUpdate: number;
    public spinnerCarousel: boolean;
    public announcementsNotExist: boolean;

    public activeSlide: number = 0;

    public counterOfHeight: number = 0;
    public scrollHeight: number = 0;

    constructor(@Inject(DOCUMENT) private document: any,
                private kvDiffers: KeyValueDiffers,
                private _configService: ConfigurationService) { }

    ngAfterViewChecked(): void {

    }

    ngDoCheck(): void {
        let annArrayChanges = this.arrayDiffer.diff(this.listOfAnnouncements);
        if (annArrayChanges) {
            console.log("... ARRAY CHANGES ...");
            
            annArrayChanges.forEachAddedItem((record) => {
                let ann = record.currentValue;
                this.annDifferMap.set(ann.announcementId, this.kvDiffers.find(ann).create());
                this.annMap.set(ann.announcementId, ann);
                console.log("Added " + ann.announcementTitle);
                
            });

            annArrayChanges.forEachRemovedItem((record) => {
                let ann = record.previousValue;
                this.annDifferMap.delete(ann.announcementId);
                this.annMap.delete(ann.announcementId);
                console.log("Removed " + ann.announcementTitle);
                
            });

            this.activeSlide = 0;
        }

        for (let [key, annDiffer] of this.annDifferMap) {
            let annChanges = annDiffer.diff(this.annMap.get(key));
            if (annChanges) {
                annChanges.forEachChangedItem(record => {
                    console.log("----- Announcement with " + key + " updated -----");
                    console.log("----- Previous value " + record.previousValue);
                    console.log("----- Current value " + record.currentValue);
                    
                });
            }
        }

        this.listOfAnnouncements = this.sortByDateModifiedThenByDateCreated(this.listOfAnnouncements);
    }

    public loadConfig(): void {
        this._configService.getConfigData(1).subscribe(data => {
            this.configApp = data;
            console.log("PARENT COMPONENET CONFIG => ", this.configApp);
            
        });
    }

    public sortByImportantByDateModifiedByDateCreated = (array: AnnouncementDetails[]) => {
        return array.sort((a, b) => { 
            return b.importantIndicator - a.importantIndicator || 
                   new Date(b.announcementDateModified).getTime() - new Date(a.announcementDateModified).getTime() ||
                   new Date(b.announcementDateCreated).getTime() - new Date(a.announcementDateCreated).getTime(); 
        });
    }

    public sortByDateModified = (array: AnnouncementDetails[]) => {
        return array.sort((a, b) => {
            if (a.announcementDateModified != null && b.announcementDateModified != null) {
                if (Date.parse(a.announcementDateModified.toString()) > Date.parse(b.announcementDateModified.toString())) {
                    if (Date.parse(a.announcementDateModified.toString()) > Date.parse(b.announcementDateModified.toString())) {
                        return 1;
                    }
                    if (Date.parse(a.announcementDateModified.toString()) < Date.parse(b.announcementDateModified.toString())) {
                        return -1;
                    }
                    return 0;
                }
            }
        });
    }

    public sortByDateModifiedThenByDateCreated = (array: AnnouncementDetails[]) => {
        return array.sort((a, b) => {
            return new Date(b.announcementDateModified).getTime() - new Date(a.announcementDateModified).getTime() ||
                   new Date(b.announcementDateCreated).getTime() - new Date(a.announcementDateCreated).getTime()
        });
    }

    public sortByDateCreated = (array: AnnouncementDetails[]) => {
        return array.sort((a, b) => new Date(b.announcementDateCreated).getTime() - new Date(a.announcementDateCreated).getTime());
    }

    ngOnInit(): void {
        this.spinnerCarousel = true;
        this.announcementsNotExist = false;

        this.loadConfig();

        console.log("CHILD CONFIG => ", this.configApp);
        
        this.duration = this.configApp?.slideDurationOnTv ?? 20000;

        this.timeForAutomaticallyUpdate = (this.configApp.automaticallyUpdate * 1000) || 3600000;

        this.arrayDiffer = this.kvDiffers.find(this.listOfAnnouncements).create();

        this.listOfAnnouncements.forEach(ann => {
            this.annDifferMap[ann.announcementId] = this.kvDiffers.find(ann).create();
            this.annMap[ann.announcementId] = ann;
        });
        
        // this.automaticallyUpdateInterval = setInterval(() => {
        //     this.loadConfig();
        // }, this.timeForAutomaticallyUpdate);
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
        var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0];
        elem.scrollTop = 0;

        if(this.duration > 0) {
            setTimeout(() => {
                clearInterval(this.interval);
                this.interval = 0;
                let scrollSpeed = 0;
                this.counterOfHeight = 0;
                
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
                this.numberOfSlideChange = 0;
                this.counterOfHeight = 0;
                
                this.scrollHeight = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0].scrollHeight;
                console.log(this.scrollHeight);
                scrollSpeed = +((this.scrollHeight / this.duration) * 100);
                
                this.interval = setInterval(() => {
                    if (this.counterOfHeight < elem.scrollHeight) {
                        this.counterOfHeight += 5;
                        elem.scrollBy(0, 5);
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
                    }
                }, 50);
                console.log("Zastoj 10 sekundi nakon povratka skrola na vrh.");
            }, 10000);
        }
        //}
        //this._afterViewInitExecuted = true;
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
}
