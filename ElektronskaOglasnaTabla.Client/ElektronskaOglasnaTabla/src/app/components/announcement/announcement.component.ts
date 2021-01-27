import { Component, OnInit, Input } from '@angular/core';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';

@Component({
    selector: 'app-announcement',
    templateUrl: './announcement.component.html',
    styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

    @Input() announcementInput = {} as AnnouncementDetails;
    public currentDate: Date;

    public isNew: boolean = false;
    //public imageExist: boolean = false;
    //public announcementImageURL: string = "https://cdn.pixabay.com/photo/2015/12/01/20/28/fall-1072821_960_720.jpg";

    constructor() { }

    ngOnInit() {

        //this.announcementInput.announcementDescription = this.announcementInput.announcementDescription.replace(/(<([^>]+)>)/gi, "");
        let currentTime = Date.now();
        let dateCreated = Date.parse(this.announcementInput.announcementDateCreated.toString());
        let differenceInMilliceconds = currentTime - dateCreated;
        let hours = (differenceInMilliceconds/(1000*60*60));
        if(Math.abs(hours) < 24)
        {
            this.announcementInput.isNew = true;
        }
    }
}
