import { Component, OnInit } from '@angular/core';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-user-statistic',
  templateUrl: './user-statistic.component.html',
  styleUrls: ['./user-statistic.component.css']
})
export class UserStatisticComponent implements OnInit {

  public statistic: Announcements[] = [];
  public numberOfAnnouncements: number = 0;

  constructor(private _statisticService: AnnouncementService) { }

  ngOnInit(): void {
    this._statisticService.getAnnouncements().subscribe(data => {
      this.statistic = data;
      this.numberOfAnnouncements = this.statistic.length;
    });
  }
}
