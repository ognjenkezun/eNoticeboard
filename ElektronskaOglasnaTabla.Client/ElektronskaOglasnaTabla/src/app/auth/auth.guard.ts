import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    
    constructor(private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot):  boolean {

        if(localStorage.getItem('token') != null) {
            if (next.data.roles && next.data.roles.indexOf(localStorage.getItem('role')) === -1) {
                // role not authorised so redirect to home page
                this.router.navigate(['/']);
                return false;
            }
            
            return true;
        }
        else {
            this.router.navigate(['/access-denied']);
            return false;
        }
    }
}
