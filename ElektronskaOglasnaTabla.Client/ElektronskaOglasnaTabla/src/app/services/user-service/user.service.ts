import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from 'src/app/models/Users';
import { UserDetails } from 'src/app/models/UserDetails';
import { ForgotPasswordModel } from 'src/app/models/ForgotPasswordModel';
import { ResetPasswordModel } from 'src/app/models/ResetPasswordModel';
import { ChangePasswordModel } from 'src/app/models/ChangePasswordModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    apiURL: string = 'http://localhost:5000/api/';

    constructor(private _httpClient: HttpClient) { 

    }

    // public getUsers(): Observable<Users[]>{
    //     return this._httpClient.get<Users[]>(`${this.apiURL}ApplicationUser/`);
    // }

    public getUsers(): Observable<Users[]>{
        return this._httpClient.get<Users[]>(`${this.apiURL}ApplicationUser/Users`);
    }

    public getUser(id: number): Observable<Users>{
        return this._httpClient.get<Users>(`${this.apiURL}ApplicationUser/${id}`);
    }

    public deleteUser(id: string): Observable<Users>{
        return this._httpClient.delete<Users>(`${this.apiURL}ApplicationUser/${id}`);
    }

    public addUser(user: Users): Observable<Users>{
        return this._httpClient.post<Users>(`${this.apiURL}ApplicationUser`, user);
    }

    public editUser(user: Users): Observable<Users>{
        return this._httpClient.put<Users>(`${this.apiURL}ApplicationUser`, user);
    }

    public editYourSelfProfile(user: Users): Observable<Users>{
        return this._httpClient.put<Users>(`${this.apiURL}ApplicationUser/editYourselfProfile`, user);
    }

    public register(user: any): Observable<any>{
        return this._httpClient.post(`${this.apiURL}` + `ApplicationUser/Register`, user);
    }

    public login(formData): Observable<any>{
        return this._httpClient.post(`${this.apiURL}` + `ApplicationUser/Login`, formData);
    }

    public logout(): Observable<any> {
        return this._httpClient.post(`${this.apiURL}ApplicationUser/Logout`, null);
    }

    public getUserProfile(): Observable<any>{
        return this._httpClient.get(`${this.apiURL}` + `ApplicationUser/getUserProfile`);
    }

    public getUsersDetails(): Observable<UserDetails[]>{
        return this._httpClient.get<UserDetails[]>(`${this.apiURL}User/UsersDetails`);
    }

    public getNumberOfUsers(): Observable<number>{
        return this._httpClient.get<number>(`${this.apiURL}` + `ApplicationUser/numberOfUsers`);
    }

    public getUsersPerPage(page: number, pageSize: number): Observable<UserDetails[]>{
        return this._httpClient.get<UserDetails[]>(`${this.apiURL}` + `ApplicationUser/userDetailsPerPage/${page}&${pageSize}`);
    }

    public forgotPassword(forgotPasswordData: ForgotPasswordModel): Observable<ForgotPasswordModel>{
        return this._httpClient.post<ForgotPasswordModel>(`${this.apiURL}ApplicationUser/forgotPassword`, forgotPasswordData);
    }

    public resetPassword(resetPasswordData: ResetPasswordModel): Observable<ResetPasswordModel>{
        return this._httpClient.post<ResetPasswordModel>(`${this.apiURL}ApplicationUser/resetPassword`, resetPasswordData);
    }

    public adminResetUserPassword(resetPasswordData: ResetPasswordModel): Observable<ResetPasswordModel>{
        return this._httpClient.post<ResetPasswordModel>(`${this.apiURL}ApplicationUser/adminResetUserPassword`, resetPasswordData);
    }

    public getLinkForResetPassword(forgotPasswordModel: ForgotPasswordModel): Observable<any>{
        return this._httpClient.post<any>(`${this.apiURL}ApplicationUser/getLinkForResetPassword`, forgotPasswordModel);
    }

    public changePassword(changePasswordData: ChangePasswordModel): Observable<ChangePasswordModel>{
        return this._httpClient.post<ChangePasswordModel>(`${this.apiURL}ApplicationUser/changePassword`, changePasswordData);
    }

    public changeUserPassword(changePasswordData: ChangePasswordModel): Observable<ChangePasswordModel>{
        return this._httpClient.post<ChangePasswordModel>(`${this.apiURL}ApplicationUser/changeUserPassword`, changePasswordData);
    }
}
