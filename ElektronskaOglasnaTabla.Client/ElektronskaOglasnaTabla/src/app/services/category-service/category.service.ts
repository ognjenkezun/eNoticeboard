import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categories } from 'src/app/models/Categories';
import { CategoriesDetails } from 'src/app/models/CategoriesDetails';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    
    apiURL: string = 'http://localhost:5000/api/';

    constructor(private _httpClient: HttpClient, private fb: FormBuilder) { 
    }

    formModel = this.fb.group({
        CategoryName: ['', Validators.required],
        PriorityName: ['', Validators.required]
    });

    public getCategories(): Observable<Categories[]> {
        return this._httpClient.get<Categories[]>(`${this.apiURL}Category/`);
    }

    public getCategory(id: number): Observable<Categories> {
        return this._httpClient.get<Categories>(`${this.apiURL}Category/${id}`);
    }

    public deleteCategory(id: number) {
        return this._httpClient.delete(`${this.apiURL}Category/${id}`);
    }

    public addCategory(category: Categories): Observable<Categories> {
        return this._httpClient.post<Categories>(`${this.apiURL}Category/`, category);
    }

    public editCategory(id: number, category: Categories): Observable<Categories> {
        return this._httpClient.put<Categories>(`${this.apiURL}Category/${id}`, category);
    }

    public getCategoriesDetails(): Observable<CategoriesDetails[]> {
        return this._httpClient.get<CategoriesDetails[]>(`${this.apiURL}Category/CategoriesDetails`);
    }

    public getCategoriesWithAnnouncements(numberOfAnnouncement: number): Observable<CategoriesDetails[]> {
        return this._httpClient.get<CategoriesDetails[]>(`${this.apiURL}Category/CategoriesWithAnnouncements/${numberOfAnnouncement}`);
    }

    public getNumberOfCategories(): Observable<number> {
        return this._httpClient.get<number>(`${this.apiURL}Category/numberOfCategories`)
    }

    public getCategoriesDetailsPage(page: number, pageSize: number): Observable<CategoriesDetails[]> {
        return this._httpClient.get<CategoriesDetails[]>(`${this.apiURL}Category/categoryDetails/${page}&${pageSize}`);
    }
}
