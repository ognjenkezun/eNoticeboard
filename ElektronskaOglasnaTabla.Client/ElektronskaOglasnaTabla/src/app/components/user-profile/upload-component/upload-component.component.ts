import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-upload-component',
    templateUrl: './upload-component.component.html',
    styleUrls: ['./upload-component.component.css']
})
export class UploadComponentComponent implements OnInit {
    public progress: number;
    public message: string;
    @Output() public onUploadFinished = new EventEmitter();

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
    }

    public uploadFile = (files) => {
        if (files.lenght === 0) {
            return;
        }

        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.http.post('http://localhost:5000/api/Upload', formData, { reportProgress: true, observe: 'events' })
            .subscribe(event => {
                if (event.type === HttpEventType.UploadProgress)
                    this.progress = Math.round(100 * event.loaded / event.total);
                else if (event.type === HttpEventType.Response){
                    this.message = "Upload success.";
                    this.onUploadFinished.emit(event.body);
                }
            });
    }
}
