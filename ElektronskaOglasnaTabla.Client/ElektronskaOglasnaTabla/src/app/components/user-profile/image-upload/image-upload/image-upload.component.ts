import { HttpEventType } from '@angular/common/http';
import { EventEmitter, ViewChild } from '@angular/core';
import { Component, ElementRef, Input, OnInit, Output } from '@angular/core';
import { ProgressStatus } from 'src/app/models/ProgressStatus';
import { ProgressStatusEnum } from 'src/app/models/ProgressStatusEnum';
import { FileService } from 'src/app/services/file-service/file.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
    @Input() public disabled: boolean;
    @Input() public listOfImages: string[] = []; 
    @Output() public uploadStatus: EventEmitter<ProgressStatus>;
    @ViewChild('inputImage') inputFile: ElementRef;

    constructor(private _fileService: FileService) {
        this.uploadStatus = new EventEmitter<ProgressStatus>();
    }

    ngOnInit() {
    }

    public upload(event) {
        if (event.target.files && event.target.files.length > 0) {
            const files = event.target.files;
            let length = files["length"];
            for(let i = 0; i < length; i ++) {
                this.listOfImages.push(files[i].name);
                console.log("Type of file => ", files[i].type);
                console.log("Type of file => ", files[i].name);
            }
            
            this.uploadStatus.emit({ status: ProgressStatusEnum.START });
            // this._fileService.uploadImages(files).subscribe(
            //     data => {
            //         console.log("DATA => ", data);
            //         if (data) {
            //             switch (data.type) {
            //                 case HttpEventType.UploadProgress:
            //                     this.uploadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
            //                     break;
            //                 case HttpEventType.Response:
            //                     //this.inputFile.nativeElement.value = '';
            //                     this.listOfImages = null;
            //                     this.uploadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
            //                     break;
            //             }
            //         }
            //     },
            //     error => {
            //         //this.inputFile.nativeElement.value = '';
            //         this.uploadStatus.emit({ status: ProgressStatusEnum.ERROR });
            //     }
            // );
        }
    }
}
