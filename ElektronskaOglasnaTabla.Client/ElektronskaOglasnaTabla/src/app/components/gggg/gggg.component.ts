import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { AppConfig } from 'src/app/models/AppConfig';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { ConfigurationService } from 'src/app/services/configuration-service/configuration.service';
import { SignalRService } from 'src/app/services/signal-r/signal-r.service';

@Component({
    selector: 'app-gggg',
    templateUrl: './gggg.component.html',
    styleUrls: ['./gggg.component.css']
})
export class GgggComponent implements OnInit {

    public listOfAnnouncements: AnnouncementDetails[] = [];
    public configApp = {} as AppConfig;

    constructor(private _announcementService: AnnouncementService,
                private _signalRService: SignalRService,
                private _configService: ConfigurationService) { 
                    
        this.subscribeToEvents();
    }

    ngOnInit(): void {
        this.loadAnnouncements();
        this.loadConfig();
    }

    public loadConfig(): void {
        this._configService.getConfigData(1).subscribe(data => {
            this.configApp = data;
            console.log("PARENT COMPONENET CONFIG => ", this.configApp);
            
        });
    }

    public loadAnnouncements(): void {
        this._announcementService.getAnnouncementsDetails().subscribe(data => {
            this.listOfAnnouncements = [];
            this.listOfAnnouncements = data;
        }, err => {
            console.log("ERROR => ", err);
            
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
   
    private subscribeToEvents(): void {
        // this._signalRService.announcementRecieved.subscribe((newAnnouncement: AnnouncementDetails) => {

        //     if (newAnnouncement != null) {
        //         newAnnouncement.isNew = this.isNew(newAnnouncement);
        //         this.listOfAnnouncements.push(newAnnouncement);
        //     }

        //     //this.loadAnnouncements();
        // });

        this._signalRService.updatedAnnouncementRecieved.subscribe((updatedAnnouncement: AnnouncementDetails) => {
            console.log("UPDATED ANNOUNCEMENT IS => ", updatedAnnouncement);

            if (updatedAnnouncement != null) {
                updatedAnnouncement.isNew = this.isNew(updatedAnnouncement);

                var findedIndex = this.listOfAnnouncements.findIndex(announcement => 
                    announcement.announcementId === updatedAnnouncement.announcementId
                );
                console.log("FINDED INDEX IS => ", findedIndex);
                if (findedIndex)
                    this.listOfAnnouncements[findedIndex] = updatedAnnouncement;
                    var ann = this.listOfAnnouncements.splice(findedIndex, 1);
                    this.listOfAnnouncements.splice(0, 0, ann[0]);
            }
            console.log("LIST IS => ", this.listOfAnnouncements);
            //this.loadAnnouncements();
        });

        // this._signalRService.deletedAnnouncementIdRecieved.subscribe((deletedAnnouncementId: number) => {
        //     console.log("DELETED ANNOUNCEMENT ID IS => ", deletedAnnouncementId);

        //     var findedIndex = this.listOfAnnouncements.findIndex(announcement => 
        //         announcement.announcementId === deletedAnnouncementId
        //     );

        //     if (findedIndex)
        //         this.listOfAnnouncements.splice(findedIndex, 1);

        //     //this.loadAnnouncements();
        // });
    }
}
