import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from 'src/app/models/Users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    apiURL: string = 'http://localhost:5000/api/';

    constructor(private _httpClient: HttpClient) { 

    }

    public getUsers(): Observable<Users[]>{
        return this._httpClient.get<Users[]>(`${this.apiURL}User/`);
    }

    public getUser(id: number): Observable<Users>{
        return this._httpClient.get<Users>(`${this.apiURL}User/${id}`);
    }

    public deleteUser(id: number){
        return this._httpClient.delete(`${this.apiURL}User/${id}`);
    }

    public addUser(user: Users): Observable<Users>{
        return this._httpClient.post<Users>(`${this.apiURL}User/`, user);
    }

    public editUser(id: number, user: Users): Observable<Users>{
        return this._httpClient.put<Users>(`${this.apiURL}User/${id}`, user);
    }

    public register(user: any): Observable<any>{
        return this._httpClient.post(`${this.apiURL}` + `ApplicationUser/Register`, user);
    }

    public login(formData){
        return this._httpClient.post(`${this.apiURL}` + `ApplicationUser/Login`, formData);
    }

    public getUserProfile(){
        return this._httpClient.get(`${this.apiURL}` + `UserProfile`);
    }
}
