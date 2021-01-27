import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/models/AppConfig';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    apiURL: string = 'http://localhost:5000/api';

    constructor(private _httpClient: HttpClient, private fb: FormBuilder) { }

    configForm = this.fb.group({
        'announcementExpiry': new FormControl(null, Validators.required),
        'automaticallyUpdate': new FormControl(null, Validators.required),
        'slideDurationOnTV': new FormControl(null, Validators.required),
        'numberOfLastAnnPerCategory': new FormControl(null, Validators.required)
    });

    public getConfigDatas(): Observable<AppConfig[]> {
        return this._httpClient.get<AppConfig[]>(`${this.apiURL}/AppConfigs/`);
    }

    public getConfigData(id: number): Observable<AppConfig> {
        return this._httpClient.get<AppConfig>(`${this.apiURL}/AppConfigs/${id}`);
    }

    public updateConfigData(id: number, config: AppConfig): Observable<AppConfig> {
        return this._httpClient.put<AppConfig>(`${this.apiURL}/AppConfigs/${id}`, config);
    }

    public getConfig(): Observable<AppConfig> {
        return this._httpClient.get<AppConfig>(`${this.apiURL}/AppConfigs/getConfig`);
    }
}
