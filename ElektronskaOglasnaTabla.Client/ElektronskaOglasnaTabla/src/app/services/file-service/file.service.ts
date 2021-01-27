import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Files } from 'src/app/models/Files';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private baseApiUrl: string;
    private apiUploadFilesUrl: string;
    private apiDownloadFileUrl: string;
    private apiGetFilesUrl: string;
    private apiUploadImagesUrl: string;
    private apiDownloadImageUrl: string;
    private apiGetImagesUrl: string;

    constructor(private _httpClient: HttpClient) {
        this.baseApiUrl = 'http://localhost:5000/api/';
        this.apiUploadFilesUrl = this.baseApiUrl + 'File/uploadFiles';
        this.apiDownloadFileUrl = this.baseApiUrl + 'File/downloadFile';
        this.apiGetFilesUrl = this.baseApiUrl + 'File/getFiles'
        this.apiUploadImagesUrl = this.baseApiUrl + 'File/uploadImages/';
        this.apiDownloadImageUrl = this.baseApiUrl + 'File/downloadImage';
        this.apiGetImagesUrl = this.baseApiUrl + 'File/getImages'
    }

    public uploadFiles(files: File[]): Observable<HttpEvent<void>> {
        // if (files.length === 0) {
        //    return;
        // }

        let filesToUpload: File[] = files;
        const formData = new FormData();

        Array.from(filesToUpload).map((file, index) => {
            return formData.append('file' + index, file, file.name);
        });

        // const formData = new FormData();
        // formData.append('file', file);

        return this._httpClient.request(new HttpRequest(
            'POST',
            this.apiUploadFilesUrl,
            formData,
            {
                reportProgress: true
            }));
    }

    public downloadFile(file: string): Observable<HttpEvent<Blob>> {
        return this._httpClient.request(new HttpRequest(
            'GET',
            `${this.apiDownloadFileUrl}/${file}`,
            null,
            {
                reportProgress: true,
                responseType: 'blob'
            }));
    }

    public getFiles(): Observable<string[]> {
        return this._httpClient.get<string[]>(this.apiGetFilesUrl);
    }

    public getFilesNames(): Observable<string[]> {
        return this._httpClient.get<string[]>(this.baseApiUrl + "File/getFilesName");
    }

    public uploadImages(image: Blob, announcementId: number): Observable<HttpEvent<void>> {
        const formData = new FormData();
        formData.append('image', image);

        return this._httpClient.request(new HttpRequest(
            'POST',
            `http://localhost:5000/api/File/uploadImages/${announcementId}`,
            formData,
            {
                reportProgress: true
            }));
    }

    public downloadImage(image: string): Observable<HttpEvent<Blob>> {
        return this._httpClient.request(new HttpRequest(
            'GET',
            `${this.apiDownloadImageUrl}?image=${image}`,
            null,
            {
                reportProgress: true,
                responseType: 'blob'
            }));
    }

    public getImages(): Observable<string[]> {
        return this._httpClient.get<string[]>(this.apiGetImagesUrl);
    }

    public addFile(files: Files[]): Observable<Files[]> {
        return this._httpClient.post<Files[]>(`http://localhost:5000/api/Files`, files);
    }
}