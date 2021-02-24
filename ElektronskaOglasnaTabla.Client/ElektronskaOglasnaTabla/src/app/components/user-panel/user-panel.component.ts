import { Component, DoCheck, Input, IterableDiffers, OnInit } from '@angular/core';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { Announcements } from 'src/app/models/Announcements';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit, DoCheck {

    @Input()
    empArray: AnnouncementDetails[];

    itrChangeLogs: string[] = [];
    empDiffer: any;

    constructor(private itrDiffers: IterableDiffers) {
    }
    ngOnInit() {
        this.empDiffer = this.itrDiffers.find([]).create(null);
    }
    ngDoCheck() {
        const empArrayChanges = this.empDiffer.diff(this.empArray);
        if (empArrayChanges) {
            empArrayChanges.forEachAddedItem(record => {
                let emp = record.item;
                console.log('Added ' + emp.name);
                this.itrChangeLogs.push('Added ' + emp.name);
            });
            empArrayChanges.forEachRemovedItem(record => {
                let emp = record.item;
                console.log('Removed ' + emp.name);
                this.itrChangeLogs.push('Removed ' + emp.name);
            });
        }
    }
}
