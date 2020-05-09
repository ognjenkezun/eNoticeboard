import { Component, OnInit, Input } from '@angular/core';
import { Announcements } from 'src/app/models/Announcements';

@Component({
    selector: 'app-announcement',
    templateUrl: './announcement.component.html',
    styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

    //POREDITI VRIJEME, AKO JE U POSLJEDNJA 25 h, ONDA IMA PLAVI BEDŽ NOVO!!!!

    @Input() announcementInput = {} as Announcements;

    public imageExist: boolean = false;
    public announcementImageURL: string = "https://cdn.pixabay.com/photo/2015/12/01/20/28/fall-1072821_960_720.jpg";

    constructor() { }

    ngOnInit() {
        if(this.announcementImageURL!=null)
        {
            this.imageExist = true;
        }
    }
}
