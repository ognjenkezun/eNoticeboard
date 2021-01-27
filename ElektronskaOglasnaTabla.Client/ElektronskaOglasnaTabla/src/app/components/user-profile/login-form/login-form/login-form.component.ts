import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { SharingDataService } from 'src/app/shared/sharing-data-service/sharing-data.service';
import { ForgotPasswordModel } from 'src/app/models/ForgotPasswordModel';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    @Output() public closeModal: EventEmitter<null>;
    //*ngIf=userDetails za prikazivanje profila
    userDetails;

    forgotPasswordModel = {} as ForgotPasswordModel;

    fieldTextType: boolean;
    repeatFieldTextType: boolean;

    loginForm: FormGroup;
    forgotPasswordForm: FormGroup;

    constructor(private _userService: UserService,
                private _router: Router,
                private _sharingDataService: SharingDataService,
                private _toastr: ToastrService) {

        this.closeModal = new EventEmitter<null>();
    }

    ngOnInit() {

        // if(localStorage.getItem('token') != null) {
        //     this.router.navigateByUrl('/home');
        // }

        // this._userService.getUserProfile().subscribe(
        //     res => {
        //         this.userDetails = res;
        //     },
        //     err => {
        //         console.log(err);
        //     }
        // );

        this.loginForm = new FormGroup({
            'userName': new FormControl('', [
                Validators.required,
                Validators.email
            ]),
            'password': new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ])
        });

        this.forgotPasswordForm = new FormGroup({
            'forgotPassword': new FormControl('', [
                Validators.required,
                Validators.email
            ])
        });
    }

    get email() { return this.loginForm.get('userName'); }

    get password() { return this.loginForm.get('password'); }

    get forgotPassword() { return this.forgotPasswordForm.get('forgotPassword'); }

    onLoginSubmit(): void {
        //PROMIJENITI DUGME U LOGOUT
        
        console.warn(this.loginForm.value);
        this._userService.login(this.loginForm.value).subscribe(
            res => {                
                //this._sharingDataService.login(true);
                this._sharingDataService.login();
                //this.isLoggedIn$ = this._sharingDataService.isLoggedIn;
                //console.log("login ---------------", this.isLoggedIn$);
                
                localStorage.setItem('token', res.token);
                localStorage.setItem('role', res.userRole);
                localStorage.setItem('username', res.userName);
                this._sharingDataService.setUserName(res.userName);
                this._sharingDataService.setAdminFlag(res.userRole);

                this._router.navigate(['/list-of-user-announcements']);
                this.loginForm.reset();
                this.closeModal.emit();
            },
            err => { 
                if(err.status == 400)
                {
                    this._toastr.error('Netačno korisničko ime ili lozinka.', 'Logovanje neuspješno.');
                }
                else
                {
                    console.log(err);
                }
            }
        );
    }

    onForgotPasswordSubmit(): void {
        this.forgotPasswordModel.email = this.forgotPasswordForm.get('forgotPassword').value;
        this._userService.forgotPassword(this.forgotPasswordModel).subscribe(succ => {
            this.forgotPasswordForm.reset();
            this._toastr.success("Instrukcije za resetovanje lozinke su poslane na unesenu e-mail adresu.", "Uspješna akcija.");
        }, err => {
            this._toastr.error("Ne postoji korisnik sa unesenom e-mail adresom.", "Dogodila se greška.");
        });

        console.log("EMAIL => ", this.forgotPasswordModel);
        this.forgotPasswordModel = null;
    }

    onLogout(): void {
        //PROMIJENITI DUGME U LOGIN
        //localStorage.removeItem('token');
        //this.router.navigate(['/home']);
    }

    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }

    toggleRepeatFieldTextType() {
        this.repeatFieldTextType = !this.repeatFieldTextType;
    }
}
