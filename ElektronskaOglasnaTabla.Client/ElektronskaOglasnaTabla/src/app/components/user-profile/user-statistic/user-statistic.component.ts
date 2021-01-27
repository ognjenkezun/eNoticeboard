import { Component, OnInit } from '@angular/core';
import { Announcements } from 'src/app/models/Announcements';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { EventEmitter } from 'protractor';
import { Statistic } from 'src/app/models/Statistic';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
    selector: 'app-user-statistic',
    templateUrl: './user-statistic.component.html',
    styleUrls: ['./user-statistic.component.css']
})
export class UserStatisticComponent implements OnInit {

    public statistic: Statistic[] = [];
    
    // public barChartData: ChartDataSets[] = [ { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' } ];
    // public barChartOptions: ChartOptions = {
    //     responsive: true,
    // };
    // // saleData = [
    // //   { name: "Mobiles", value: 105000 },
    // //   { name: "Laptop", value: 55000 },
    // //   { name: "AC", value: 15000 },
    // //   { name: "Headset", value: 150000 },
    // //   { name: "Fridge", value: 20000 }
    // // ];
    // //public barChartLabels: Label[] = [];
    // public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    // public barChartType: ChartType = 'bar';
    // public barChartLegend = true;
    // public barChartPlugins = [];
    public barChartOptions: ChartOptions = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{}], yAxes: [{ ticks: { beginAtZero: true } }] },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
            }
        }
    };

    public barChartLabels: Label[] = ["Statistika"];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];
  
    public barChartData: ChartDataSets[] = [];

    constructor(private _announcementService: AnnouncementService) { }

    ngOnInit(): void {
        this._announcementService.getAnnouncementsStatistic().subscribe(data => {
            this.statistic = data;
            console.log("Data =======> ", data);
            console.log("Statistic =======> ", this.statistic);
            this.barChartData = [];
            this.statistic.forEach(element => {
                //this.barChartLabels.push(element.user);
                
                this.barChartData.push({ data: [element.numberOfUserAnnouncements], label: element.user });
                //this.barChartData['label'] = element.user;
            });
            //this.barChartData.push({ data: this.statistic['numberOfUserAnnouncements'], label: this.statistic["user"] });
            console.log("ChartDataSets =======> ", this.barChartData);
            ///this.barChartLabels = this.statistic["user"];
            //this.barChartData = [ { data: this.statistic['numberOfUserAnnouncement'] } ];
            //this.barChartData = [{ data: this.statistic["numberOfUserAnnouncements"], label: this.statistic["user"] }];
        });
        // this.barChartData.push({ data: this.statistic['numberOfUserAnnouncements'], label: this.statistic["user"] });
        //this.barChartData = { data: this.statistic['dasd'], label: };
    }
}