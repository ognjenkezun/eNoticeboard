import { Component, OnInit, Input } from '@angular/core';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Router } from '@angular/router';

export const ANNOUNCEMENTSARRAY: Announcements[] = [
    {
        announcementId: 1,
        announcementTitle: "Upis studenata",
        announcementDescription: "Obavjestavaju se svi studenti da upis u novu skolsku godinu traje do 15.10.2020. godine",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 1,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 0,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    },
    {
        announcementId: 2,
        announcementTitle: "Upis ocjena iz predmeta Osnove elektrotehnike 2",
        announcementDescription: "Obavjestavaju se svi studenti.",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 2,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 1,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    },
    {
        announcementId: 3,
        announcementTitle: "Elektrijada",
        announcementDescription: "Ovogodisnja elektrijada ce se odrzati u Budvi sa pocetkom 15.5.2020. godine.",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 2,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 1,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    },
    {
        announcementId: 4,
        announcementTitle: "Infotech",
        announcementDescription: "Infotech je pomjeren ya 20.04.2020. godine, pa ko nije predao prijavu za ucesce ima jos 7 dana. Na Inftech-u ce ucesnici biti iz svih drazava EX YU.",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 2,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 0,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    },
    {
        announcementId: 5,
        announcementTitle: "Upis ocjena iz predmeta Osnove elektrotehnike 2",
        announcementDescription: "Obavjestavaju se svi studenti.",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 2,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 1,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    },
    {
        announcementId: 6,
        announcementTitle: "Usmeni ispit iz PJ",
        announcementDescription: "Usmeni ispit iz PJ ce se odrzati 17.06.2020. god. u 12:00.",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 2,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 0,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    },
    {
        announcementId: 7,
        announcementTitle: "Predavanja kod prof. dr Ilinke Unkovic",
        announcementDescription: "Obavjestavaju se svi studenti koji slusaju predmete kod prof. dr Ilinke Unkovic da ce predavanja biti odgodjena narednih mjesec dana. Naknadno c ebiti obavjestenje o sljedecem terminu predavanja.",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 2,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 0,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    },
    {
        announcementId: 8,
        announcementTitle: "Posljednje predavanje prod. dr Slavka Pokornog",
        announcementDescription: "Posljednje predavanje povodom odlaska prod. dr Slavka Pokornog u penziju ce biti odrzano 14.04.2020. godine u 09:00 u velikom amfiteatru.",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 2,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 1,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    },
    {
        announcementId: 9,
        announcementTitle: "Rezultati pismenog ispita iz Elektronike 1",
        announcementDescription: "Pismeni ispit iz Elektronike 1 nije niko polozio",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 2,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 0,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    },
    {
        announcementId: 10,
        announcementTitle: "Ispit iz predmeta Matematika 1",
        announcementDescription: "Ispit iz predmeta Matematika 1 ce se odrzati 19.05.2020. godine sa pocetkom u 15:00.",
        announcementDateCreated: new Date('June 15, 2015'),
        announcementDateModified: new Date('June 15, 2015'),
        announcementUserModified: 2,
        announcementExpiryDate: new Date('June 15, 2015'),
        announcementImportantIndicator: 0,
        userId: 1,
        categoryId: 1,
        isDeleted: false
    }
];

@Component({
    selector: 'app-central-panel',
    templateUrl: './central-panel.component.html',
    styleUrls: ['./central-panel.component.css'],
    providers: [
        Ng2SearchPipeModule
    ]
})
export class CentralPanelComponent implements OnInit {

  //KREIRATI NIZ OD 12 OVBAVIJESTENJA I TO PRIKAZIVATI, TJ. SAMO NAJNOVIJE!!!!

  @Input() listOfAnnouncements: Announcements[];
  public list: Announcements[] = [];

  public search: string;

  constructor(private _announcementService: AnnouncementService,
              private _router: Router) { 
      //this.listOfAnnouncements = ANNOUNCEMENTSARRAY;
  }

  ngOnInit() {
      this.loadAllAnnouncements();
  }

  public loadAllAnnouncements(): void {
      this._announcementService.getAnnouncements().subscribe(data => {
          this.listOfAnnouncements = data;
          //this.list = data;
      });
  }

  onClick(announcementId: number): void {
    this._router.navigate(['/one-announcement-page', announcementId]);
  }
}
