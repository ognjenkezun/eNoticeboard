import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { ProgressStatus } from 'src/app/models/ProgressStatus';
import { ProgressStatusEnum } from 'src/app/models/ProgressStatusEnum';
import { FileService } from 'src/app/services/file-service/file.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
    @Input() public disabled: boolean;
    @Input() public listOfFiles: string[] = []; 
    @Output() public uploadStatus: EventEmitter<ProgressStatus>;
    @ViewChild('inputFile') inputFile: ElementRef;

    constructor(private _fileService: FileService) {
        this.uploadStatus = new EventEmitter<ProgressStatus>();
    }

    ngOnInit() {
    }

    public upload(event) {
        if (event.target.files && event.target.files.length > 0) {
            const files = event.target.files;
            console.log("FILES => ", files["length"]);
            let length = files["length"];
            console.log("FILES => ", files[0].name);
            for(let i = 0; i < files["length"]; i ++) {
                this.listOfFiles.push(files[i].name);
            }
            
            this.uploadStatus.emit({ status: ProgressStatusEnum.START });
            this._fileService.uploadFiles(files).subscribe(
                data => {
                    if (data) {
                        switch (data.type) {
                            case HttpEventType.UploadProgress:
                                this.uploadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
                                break;
                            case HttpEventType.Response:
                                //this.inputFile.nativeElement.value = '';
                                this.listOfFiles = null;
                                this.uploadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
                                break;
                        }
                    }
                },
                error => {
                    //this.inputFile.nativeElement.value = '';
                    this.uploadStatus.emit({ status: ProgressStatusEnum.ERROR });
                }
            );
        }
    }
}
