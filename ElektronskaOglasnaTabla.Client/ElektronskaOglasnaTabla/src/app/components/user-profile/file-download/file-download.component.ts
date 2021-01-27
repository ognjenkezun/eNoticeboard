import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ProgressStatus } from 'src/app/models/ProgressStatus';
import { ProgressStatusEnum } from 'src/app/models/ProgressStatusEnum';
import { FileService } from 'src/app/services/file-service/file.service';

@Component({
    selector: 'app-file-download',
    templateUrl: './file-download.component.html',
    styleUrls: ['./file-download.component.css']
})
export class FileDownloadComponent implements OnInit {
    @Input() public disabled: boolean;
    @Input() public fileName: string;
    @Output() public downloadStatus: EventEmitter<ProgressStatus>;

    constructor(private _fileService: FileService) {
        this.downloadStatus = new EventEmitter<ProgressStatus>();
    }

    ngOnInit(): void {
    }

    public download() {
        this.downloadStatus.emit({ status: ProgressStatusEnum.START });
        this._fileService.downloadFile(this.fileName).subscribe(
            data => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        this.downloadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
                        break;
                    case HttpEventType.Response:
                        this.downloadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display: none;');
                        document.body.appendChild(a);
                        a.download = this.fileName;
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
            },
            error => {
                this.downloadStatus.emit({ status: ProgressStatusEnum.ERROR });
            }
        );
    }
}
