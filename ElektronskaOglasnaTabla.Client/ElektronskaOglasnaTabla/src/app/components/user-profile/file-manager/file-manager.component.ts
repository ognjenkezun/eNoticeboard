import { Component, Input, OnInit } from '@angular/core';
import { ProgressStatus } from 'src/app/models/ProgressStatus';
import { ProgressStatusEnum } from 'src/app/models/ProgressStatusEnum';
import { FileService } from 'src/app/services/file-service/file.service';

@Component({
    selector: 'app-file-manager',
    templateUrl: './file-manager.component.html',
    styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

    @Input() listOfFiles: string[] = [];
    public files: string[];
    public fileInDownload: string;
    public percentage: number;
    public showProgress: boolean;
    public showDownloadError: boolean;
    public showUploadError: boolean;

    constructor(private _fileService: FileService) { }

    ngOnInit(): void {
        //this.getFiles();
    }

    // private getFiles() {
    //     this._fileService.getFilesNames().subscribe(
    //         data => {
    //             this.files = data;
    //             console.log("FILES PATH file manger=> ", data);
    //         }
    //     );
    // }

    public downloadStatus(event: ProgressStatus) {
        switch (event.status) {
            case ProgressStatusEnum.START:
                this.showDownloadError = false;
                break;
            case ProgressStatusEnum.IN_PROGRESS:
                this.showProgress = true;
                this.percentage = event.percentage;
                break;
            case ProgressStatusEnum.COMPLETE:
                this.showProgress = false;
                break;
            case ProgressStatusEnum.ERROR:
                this.showProgress = false;
                this.showDownloadError = true;
                break;
        }
    }

    public uploadStatus(event: ProgressStatus) {
        switch (event.status) {
            case ProgressStatusEnum.START:
                this.showUploadError = false;
                break;
            case ProgressStatusEnum.IN_PROGRESS:
                this.showProgress = true;
                this.percentage = event.percentage;
                break;
            case ProgressStatusEnum.COMPLETE:
                this.showProgress = false;
                break;
            case ProgressStatusEnum.ERROR:
                this.showProgress = false;
                this.showUploadError = true;
                break;
        }
    }
}
