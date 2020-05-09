import { Component, OnInit, Input } from '@angular/core';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-announcement-page',
  templateUrl: './announcement-page.component.html',
  styleUrls: ['./announcement-page.component.css']
})
export class AnnouncementPageComponent implements OnInit {

  //POREDITI VRIJEME, AKO JE U POSLJEDNJA 25 h, ONDA IMA PLAVI BEDŽ NOVO!!!!

  public announcement = {} as Announcements;
  public listAnnouncements = [] as Announcements[];

  constructor(private _announcementService: AnnouncementService,
              private _route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = +this._route.snapshot.params['id'];
    this._announcementService.getAnnouncement(id).subscribe(data =>{
      this.announcement = data;
    });
    //////////////
    //this.loadAnnonucements();
  }

  loadAnnonucements(): void {
    this._announcementService.getAnnouncements().subscribe(data => {
      this.listAnnouncements = data;
    });
  }
}
