import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Priorities } from 'src/app/models/Priorities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {

    apiURL: string = 'http://localhost:5000/api/';

    constructor(private _httpClient: HttpClient) { 

    }

    public getPriorities(): Observable<Priorities[]>{
        return this._httpClient.get<Priorities[]>(`${this.apiURL}Priority/`);
    }

    public getPriority(id: number): Observable<Priorities>{
        return this._httpClient.get<Priorities>(`${this.apiURL}Priority/${id}`);
    }

    public deletePriority(id: number){
        return this._httpClient.delete(`${this.apiURL}Priority/${id}`);
    }

    public addPriority(priority: Priorities): Observable<Priorities>{
        return this._httpClient.post<Priorities>(`${this.apiURL}Priority/`, priority);
    }

    public editPriority(priority: Priorities): Observable<Priorities>{
        return this._httpClient.put<Priorities>(`${this.apiURL}Priority/`, priority);
    }
}
