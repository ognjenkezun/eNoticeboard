import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, QueryList, OnDestroy, Inject } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { DOCUMENT } from '@angular/common';
import { FileService } from 'src/app/services/file-service/file.service';
import { PDFDocumentProxy, PDFProgressData } from 'ng2-pdf-viewer';
import { Announcements } from 'src/app/models/Announcements';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';
import { AppConfig } from 'src/app/models/AppConfig';
import { config } from 'rxjs';
import { SignalRService } from 'src/app/services/signal-r/signal-r.service';

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
    public sssss: AnnouncementDetails = {
        announcementId: 4343,
        announcementTitle: "Sasdakd asdjoiajdaoddadasdasdasdas",
        announcementDescription: "Dadsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa adsad sdadaji joiajdijaijaj a dsajasjdjasjd adasjdajsoijdaijdojasodja asdjajsdoa ",
        announcementDateCreated: new Date("1 January, 2020, 11:00:00 UTC"),
        announcementDateModified: new Date("29 January, 2020, 00:43:57 UTC"),
        announcementExpiryDate: new Date("31 January, 2020, 00:00:00 UTC"),
        importantIndicator: 1,
        userCreatedFirstName: "Miloš",
        userCreatedLastName: "Milošević",
        userModifiedFirstName: "Miloš",
        userModifiedLastName: "Milošević",
        userCreatedId: "1",
        userCreatedEmail: "dsd",
        userCreatedTypeId: 1,
        userCreatedTypeName: "ds",
        userModifiedId: "1",
        userModifiedEmail: "df",
        userModifiedTypeId: 1,
        userModifiedTypeName: "1",
        categoryId: 1,
        priorityId: 1,
        priorityValue: "ssd",
        categoryName: "Sdasdadas",
        announcementShow: true,
        isNew: true,
        files: [{ filePath: "http://localhost:5000/Resources/Files/ETF-prijavljeni kandidati.pdf", fileId: 1, type: "application/pdf", announcementId: 1},
                { filePath: "http://localhost:5000/Resources/Files/Elektrijada s3.jpg", fileId: 2, type: "image/jpeg", announcementId: 1},
                { filePath: "http://localhost:5000/Resources/Files/Elektrijada s4.jpeg", fileId: 3, type: "image/jpeg", announcementId: 1},
                { filePath: "http://localhost:5000/Resources/Files/Elektrijada s5.jpg", fileId: 4, type: "image/jpeg", announcementId: 1}]
    };

    public configApp = {} as AppConfig;

    public duration: number;
    public numberOfSlideChange: number = 0;
    public numberOfFinishVideo: number = 0;
    
    public arrayOfElements: QueryList<ElementRef>;
    public fullscreenComponent;

    public listOfMockAnnouncement = [];

    public interval;
    public automaticallyUpdateInterval;
    public timeForAutomaticallyUpdate: number;
    public spinnerCarousel: boolean;
    public announcementsNotExist: boolean;

    public activeSlide: number = 0;
    private _afterViewInitExecuted: boolean = false;

    public counterOfHeight: number = 0;
    public scrollHeight: number = 0;
    public endDetected: boolean = false;

    public listOfAnnouncements: AnnouncementDetails[] = [];

    constructor(private _announcementService: AnnouncementService,
                private _configService: ConfigurationService,
                private _signalRService: SignalRService,
                @Inject(DOCUMENT) private document: any) { 
                    
        //this.blabla = this.blabla.bind(this);
        this.subscribeToEvents();
        this.listOfMockAnnouncement = [{
            announcementId: 1,
            announcementTitle: "Prvi",
            announcementDescription: "Prvi",
            announcementDateCreated: new Date("1 January, 2020, 11:00:00 UTC"),
            announcementDateModified: new Date("29 January, 2020, 00:43:57 UTC"),
            announcementExpiryDate: new Date("31 January, 2020, 00:00:00 UTC"),
            importantIndicator: 1,
            userCreatedFirstName: "Miloš",
            userCreatedLastName: "Milošević",
            userModifiedFirstName: "Miloš",
            userModifiedLastName: "Milošević",
            categoryName: "Sdasdadas",
            announcementShow: true,
            isNew: true,
            files: []
        }, {
            announcementId: 2,
            announcementTitle: "Drugi",
            announcementDescription: "Drugi",
            announcementDateCreated: new Date("5 February, 2020, 21:55:15 UTC"),
            announcementDateModified: null,
            announcementExpiryDate: new Date("25 March, 2021, 00:00:00 UTC"),
            importantIndicator: 0,
            userCreatedFirstName: "Petar",
            userCreatedLastName: "Stević",
            userModifiedFirstName: "Stevan",
            userModifiedLastName: "Jošilo",
            categoryName: "DASFDFSDFSDF",
            announcementShow: true,
            isNew: false,
            files: []
        }, {
            announcementId: 3,
            announcementTitle: "Treci",
            announcementDescription: "Treci",
            announcementDateCreated: new Date("5 January, 2020, 21:55:15 UTC"),
            announcementDateModified: null,
            announcementExpiryDate: new Date("25 March, 2021, 00:00:00 UTC"),
            importantIndicator: 1,
            userCreatedFirstName: "Petar",
            userCreatedLastName: "Stević",
            userModifiedFirstName: "Stevan",
            userModifiedLastName: "Jošilo",
            categoryName: "DASFDFSDFSDF",
            announcementShow: true,
            isNew: true,
            files: []
        }, {
            announcementId: 4,
            announcementTitle: "Cetvrti",
            announcementDescription: "Cetvrti",
            announcementDateCreated: new Date("22 February, 2020, 21:55:15 UTC"),
            announcementDateModified: new Date("25 March, 2021, 10:01:17 UTC"),
            announcementExpiryDate: new Date("25 March, 2021, 00:00:00 UTC"),
            importantIndicator: 1,
            userCreatedFirstName: "Petar",
            userCreatedLastName: "Stević",
            userModifiedFirstName: "Stevan",
            userModifiedLastName: "Jošilo",
            categoryName: "DASFDFSDFSDF",
            announcementShow: true,
            isNew: false,
            files: []
        }, {
            announcementId: 5,
            announcementTitle: "Peti",
            announcementDescription: "Peti",
            announcementDateCreated: new Date("10 March, 2020, 21:55:15 UTC"),
            announcementDateModified: new Date("15 March, 2021, 10:01:17 UTC"),
            announcementExpiryDate: new Date("25 March, 2021, 00:00:00 UTC"),
            importantIndicator: 0,
            userCreatedFirstName: "Petar",
            userCreatedLastName: "Stević",
            userModifiedFirstName: "Stevan",
            userModifiedLastName: "Jošilo",
            categoryName: "DASFDFSDFSDF",
            announcementShow: true,
            isNew: true,
            files: []
        }];
///////////////////////////////////////////////////////////////////////////
        // const tempImportant: AnnouncementDetails[] = [];
        // this.listOfMockAnnouncement.forEach(element => {
        //     if (element.importantIndicator === 1) {
        //         tempImportant.push(element);
        //     }
        // });
        // console.log("JUST IMPORTANT => ", tempImportant);
        // const tempNotImportant: AnnouncementDetails[] = [];
        // this.listOfMockAnnouncement.forEach(element => {
        //     if (element.importantIndicator === 0) {
        //         tempNotImportant.push(element);
        //     }
        // });
        // console.log("JUST NOT IMPORTANT => ", tempNotImportant);
////////////////////////////////////////////////////////////////////////////
        // tempImportant.sort((a, b) => {
        //     return b.announcementDateModified - aannouncementDateModified;
        // });

        // this.listOfMockAnnouncement.sort((a, b) => {
        //     // if (a.importantIndicator === b.importantIndicator) {
        //     //     return a.AnnouncementDateModified - b.AnnouncementDateModified;
        //     // }
        //     return b.importantIndicator - a.importantIndicator;
        // });

        const arr = this.sortByImportant(this.listOfMockAnnouncement);
        console.log("SORT BY IMPORTANT LIST --------> ", arr);
        // const srotedByDM = this.sortByDateModified(arr);
        // console.log("SORT BY DATE MODIFIED LIST --------> ", srotedByDM);
        
            // if (x.AnnouncementDateModified != null) {
            //     if (Date.parse(x.AnnouncementDateModified.toString()) > Date.parse(y.AnnouncementDateCreated.toString())) {
            //         if (Date.parse(x.AnnouncementDateModified.toString()) > Date.parse(y.AnnouncementDateModified.toString())) {
            //             return 1;
            //         }
            //         if (Date.parse(x.AnnouncementDateModified.toString()) < Date.parse(y.AnnouncementDateModified.toString())) {
            //             return -1;
            //         }
            //         return 0;
            //     }
            // }
            // else {
            //     if (Date.parse(x.announcementDateCreated.toString()) > Date.parse(y.announcementDateCreated.toString())) {
            //         return 1;
            //     }
            //     if (Date.parse(x.announcementDateCreated.toString()) < Date.parse(y.announcementDateCreated.toString())) {
            //         return -1;
            //     }
            //     return 0;
            // }
        
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
                //return Date.parse(b.announcementDateModified.toString()) - Date.parse(a.announcementDateModified.toString())
            }
        });
    }

    public sortByDateCreated = (array: AnnouncementDetails[]) => {
        return array.sort((a, b) => new Date(b.announcementDateCreated).getTime() - new Date(a.announcementDateCreated).getTime());
    }

    public sortByImportant = (array: AnnouncementDetails[]) => {
        return array.sort((a, b) => { 
            return b.importantIndicator - a.importantIndicator || 
                   new Date(b.announcementDateModified).getTime() - new Date(a.announcementDateModified).getTime() ||
                   new Date(b.announcementDateCreated).getTime() - new Date(a.announcementDateCreated).getTime(); 
        });
        
    }

    ngOnInit(): void {
        this.spinnerCarousel = true;
        this.announcementsNotExist = false;
        
        this.loadConfig();
        this.loadAnnouncements();

        this.timeForAutomaticallyUpdate = (this.configApp.automaticallyUpdate * 1000) || 3600000;
        
        this.automaticallyUpdateInterval = setInterval(() => {
            this.loadConfig();
            this.loadAnnouncements();
        }, this.timeForAutomaticallyUpdate);
        
        // this._fileService.getFiles().subscribe(data => {
        //     this.listOfFilesPaths = data;
        //     //console.log("FILE PATHS => ", data);
        // });
        
        // this._fileService.getImages().subscribe(data => {
        //     this.listOfImagesPaths = data;
        //     //console.log("IMAGE PATHS => ", data);
        // });
    }

    ngAfterViewInit(): void {
        //console.log(this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children);
        this.fullscreenComponent = this.tvContainer.nativeElement;
        this._afterViewInitExecuted = true;
        //this.blabla(0);
        console.log("After view init => ", this.tvContainer);
    }
    
    ngOnDestroy(): void {
        clearInterval(this.interval);
        this.interval = 0;
        clearInterval(this.automaticallyUpdateInterval);
        this.automaticallyUpdateInterval = 0;
    }

    public loadAnnouncements(): void {
        this._announcementService.getAnnouncementsDetails().subscribe(data => {
            let currentTime = Date.now();
            
            //this.listOfAnnouncements = [];
            this.listOfAnnouncements = data;
            this.listOfAnnouncements.forEach(announcement => {

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
                    announcement.isNew = true;
                }
            });

            this.spinnerCarousel = false;

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
            this.configApp = data;
            this.duration = (this.configApp.slideDurationOnTv * 1000) || 30000;
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
                file.type.includes("video")
            );
        }
    }

    filterImages(announcement: AnnouncementDetails) {
        if (announcement.files) {
            //const condition = 
            return announcement.files.filter(file =>
                file.type.includes("image")
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
        //console.log("(after-load-complete) --> ", pdf);
    }

    onSlideChangeeee(event: any): void {
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
        //this.duration = 5000;
        this.interval = 0;
        let scrollSpeed = 0;
        this.numberOfSlideChange = 0;
        this.counterOfHeight = 0;
        this.numberOfFinishVideo = 0;

        setTimeout(() => {
            console.log("Zastoj 5 sekundi nakon prebacivanja na sljedeči slajd.");
        }, 5000);
        
        setTimeout(() => {
            if (this.activeSlide < this.listOfAnnouncements.length) {
                var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0];
                elem.scrollTop = 0;
                //console.log("ELEM ============> ", elem);
                
                this.scrollHeight = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0].scrollHeight;
                //console.log(this.scrollHeight);
                scrollSpeed = +((this.scrollHeight / this.duration) * 100);
                
                this.interval = setInterval(() => {
                    if (this.counterOfHeight < elem.scrollHeight) {
                        this.counterOfHeight += scrollSpeed;
                        //this.counterOfHeight += 1;
                        elem.scrollBy(0, scrollSpeed);
                        //elem.scrollBy(0, 1);
                    }
                    else {
                        //this.duration = 1000;
                        //console.log("Slide Height => ", this.counterOfHeight);
                        // this.counterOfHeight = 0;
                        // this.numberOfSlideChange ++;
                        //console.log("Number of slide changes => ", this.numberOfSlideChange);
                        // if (this.numberOfSlideChange == 2) {
                        //     //console.log("Count => ", this.activeSlide);
                        //     //Pokusati sa videom i provjeriti
                        //     //this.activeSlide ++;
                        //     //if (this.activeSlide == this.listOfAnnouncements.length) {
                        //     //    this.activeSlide = 0;
                        //     //}
                        //     clearInterval(this.interval);
                        //     this.interval = 0;
                        //     this.numberOfSlideChange = 0;
                        this.counterOfHeight = 0;
                        // }
                        elem.scrollTop = 0;
                        //////Pokusati
                        // setTimeout(() => {
                        //     console.log("Zastoj 10 sekundi nakon povratka skrola na vrh.");
                        // }, 10000);
                    }
                }, 50);
            }
            else {
                this.activeSlide = 0;
            }
        }, 20000);
    }

    onSlideChange(event: any): void {
        console.log("This outside => ", this.tvContainer);
        console.log("ACTIVE SLIDE => ", this.activeSlide);
         
        //if (this._afterViewInitExecuted) {
            var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[event].children[0].children[0].children[0].children[0];
            elem.scrollTop = 0;
            setTimeout(() => {
                clearInterval(this.interval);
                this.interval = 0;
                let scrollSpeed = 0;
                this.numberOfSlideChange = 0;
                this.counterOfHeight = 0;
                
                //var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0];
                //elem.scrollTop = 0;
                
                this.scrollHeight = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[event].children[0].children[0].children[0].children[0].scrollHeight;
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
        //}
        //this._afterViewInitExecuted = true;
    }

    //skrolanje 2 x, pa promjena slajda sa zadrskom od 10 sekundi na vrhu
    // scrollingTwoTimes(event: any): void {
    //     //console.log("Active slide is event ", event, this.activeSlide);
    //     console.log("EVENT => ", event);
    //     setTimeout(() => {
    //         clearInterval(this.interval);
    //         this.interval = 0;
    //         let scrollSpeed = 0;
    //         //this.duration = 5000;
    //         this.numberOfSlideChange = 0;
    //         this.counterOfHeight = 0;
            
    //         var elem = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0];
    //         elem.scrollTop = 0;
            
    //         this.scrollHeight = this.tvContainer.nativeElement.children[0].children[0].children[0].children[0].children[0].children[this.activeSlide].children[0].children[0].children[0].children[0].scrollHeight;
    //         console.log(this.scrollHeight);
    //         scrollSpeed = +((this.scrollHeight / this.duration) * 100);
            
    //         this.interval = setInterval(() => {
    //             if (this.counterOfHeight < elem.scrollHeight) {
    //                 //this.counterOfHeight += scrollSpeed;
    //                 this.counterOfHeight += 5;
    //                 elem.scrollBy(0, 5);
    //                 //elem.scrollBy(0, 1);
    //             }
    //             else {
    //                 this.counterOfHeight = 0;
    //                 this.numberOfSlideChange ++;
    //                 console.log("Number of slide changes => ", this.numberOfSlideChange);
    //                 if (this.numberOfSlideChange == 2) {
    //                     console.log("Count => ", this.activeSlide);
    //                     if (this.activeSlide === (this.listOfAnnouncements.length - 1))
    //                         this.activeSlide = 0;
    //                     else
    //                         this.activeSlide ++;
    //                     this.numberOfSlideChange = 0;
    //                 }
    //                 elem.scrollTop = 0;
    //                 //////Pokusati
    //                 // setTimeout(() => {
    //                 //     console.log("Zastoj 10 sekundi nakon povratka skrola na vrh.");
    //                 // }, 10000);
    //             }
    //         }, 50);
    //         console.log("Zastoj 10 sekundi nakon povratka skrola na vrh.");
    //     }, 10000);
    // }

    onVideoEnded(event): void {
        //console.log("Event => ", event);
        //console.log("End of video detected!");
        this.numberOfFinishVideo ++;
    }

    pageRendered(e: CustomEvent) {
        //console.log("(page-rendered) --> ", e);
    }

    textLayerRendered(e: CustomEvent) {
        //console.log("(text-layer-rendered) --> ", e);

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
        //console.log("(on-progress) --> ", progressData);
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

    private subscribeToEvents(): void {
        //this._afterViewInitExecuted = false;
        //this.listOfAnnouncements = [];
        //Sending all data trought sockets
        // this._signalR.announcementRecieved.subscribe((announcement: Announcements) => {
        //     this.listOfAnnouncements.unshift(this.sssss);
        //     console.log("RECIEVED ANNOUNCEMENT => ", announcement);
        //     console.log("UNSHIFT UPDATED LIST IS => ", this.listOfAnnouncements);
        //     console.log("UNSHIFT LIST COUNT IS => ", this.listOfAnnouncements.length);
        //     this.activeSlide = (this.listOfAnnouncements.length - 2);
        // });
        this._signalRService.announcementRecieved.subscribe((newAnnouncement: AnnouncementDetails) => {
            //this._chatService.messageReceived.subscribe((newAnnouncement: AnnouncementDetails) => {

            newAnnouncement.isNew = this.isNew(newAnnouncement);
                
            this.listOfAnnouncements.unshift(newAnnouncement);
            console.log("RECIEVED ANNOUNCEMENT IS => ", newAnnouncement);
            console.log("UNSHIFT UPDATED LIST IS => ", this.listOfAnnouncements);
            console.log("UNSHIFT LIST COUNT IS => ", this.listOfAnnouncements.length);
            //this.listOfAnnouncements.push(newAnnouncement);
            //console.log("PUSH UPDATED LIST IS => ", this.listOfAnnouncements);
            //console.log("PUSH LIST COUNT IS => ", this.listOfAnnouncements.length);
            
            this.activeSlide = (this.listOfAnnouncements.length - 1);
            console.log("ACTIVE SLIDE IS ", this.activeSlide);
            //this.loadConfig();
            //this.loadAnnouncements();
        });

        this._signalRService.updatedAnnouncementRecieved.subscribe((updatedAnnouncement: AnnouncementDetails) => {
            console.log("UPDATED ANNOUNCEMENT IS => ", updatedAnnouncement);

            updatedAnnouncement.isNew = this.isNew(updatedAnnouncement);

            var findedIndex = this.listOfAnnouncements.findIndex(announcement => 
                announcement.announcementId === updatedAnnouncement.announcementId
            );
            console.log("FOUNDED INDEX IS => ", findedIndex);
            this.listOfAnnouncements[findedIndex] = updatedAnnouncement;

            console.log("LIST IS => ", this.listOfAnnouncements);
        });

        this._signalRService.deletedAnnouncementIdRecieved.subscribe((deletedAnnouncementId: number) => {
            console.log("DELETED ANNOUNCEMENT ID IS => ", deletedAnnouncementId);

            var findedIndex = this.listOfAnnouncements.findIndex(announcement => 
                announcement.announcementId === deletedAnnouncementId
            );
            
            if (this.activeSlide === findedIndex)
                this.activeSlide ++;

            this.listOfAnnouncements.splice(findedIndex, 1);
        });
    }
}
