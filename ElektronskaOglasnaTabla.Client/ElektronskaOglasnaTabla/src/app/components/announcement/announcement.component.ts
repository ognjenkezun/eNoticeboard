import { Component, OnInit, Input } from '@angular/core';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';

@Component({
    selector: 'app-announcement',
    templateUrl: './announcement.component.html',
    styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

    @Input() announcementInput = {} as AnnouncementDetails;
    @Input() announcementExpiry: number;
    public currentDate: Date;

    public isNew: boolean = false;

    constructor() { }

    ngOnInit() {

        this.stripHtml(this.announcementInput.announcementDescription);

        let currentTime = Date.now();
        let dateCreated = Date.parse(this.announcementInput.announcementDateCreated.toString());
        let differenceInMillicecondsCreated = currentTime - dateCreated;
        let hoursCreated = (differenceInMillicecondsCreated / (1000 * 60  *60));

        if (this.announcementInput.announcementDateModified != null) {
            let dateModified = Date.parse(this.announcementInput.announcementDateModified.toString());
            let differenceInMillicecondsModified = currentTime - dateModified;
            var hoursModified = (differenceInMillicecondsModified / (1000 * 60 * 60)) || 0;
        }

        if (Math.abs(hoursCreated) < (this.announcementExpiry * 24) ||
            Math.abs(hoursModified) < (this.announcementExpiry * 24)) {
                
            this.announcementInput.isNew = true;
        }
    }

    filterImages(announcement: AnnouncementDetails) {
        let file;
        if (announcement.files.length) {
            
            file = announcement.files.filter(file =>
                file.type.includes("image")
            );
        }
        else {
            file = [];
        }
        
        return file;
    }

    stripHtml(html: string): void {
        let tmp = document.createElement("element");
        tmp.innerHTML = html.replace(/(<([^>]+)>)/gi, " ");
        this.announcementInput.announcementDescription = tmp.textContent || tmp.innerText || "";
    }
}
