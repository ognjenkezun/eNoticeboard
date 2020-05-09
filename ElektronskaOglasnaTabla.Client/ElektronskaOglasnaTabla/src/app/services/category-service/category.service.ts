import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categories } from 'src/app/models/Categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    
    apiURL: string = 'http://localhost:5000/api/';

    constructor(private _httpClient: HttpClient) { 

    }

    public getCategories(): Observable<Categories[]>{
        return this._httpClient.get<Categories[]>(`${this.apiURL}Category/`);
    }

    public getCategory(id: number): Observable<Categories>{
        return this._httpClient.get<Categories>(`${this.apiURL}Category/${id}`);
    }

    public deleteCategory(id: number){
        return this._httpClient.delete(`${this.apiURL}Category/${id}`);
    }

    public addCategory(category: Categories): Observable<Categories>{
        return this._httpClient.post<Categories>(`${this.apiURL}Category/`, category);
    }

    public editCategory(category: Categories): Observable<Categories>{
        return this._httpClient.put<Categories>(`${this.apiURL}Category/`, category);
    }
}
