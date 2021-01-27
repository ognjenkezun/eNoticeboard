import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user-service/user.service';
import { SharingDataService } from 'src/app/shared/sharing-data-service/sharing-data.service';

@Component({
  selector: 'app-ffff',
  templateUrl: './ffff.component.html',
  styleUrls: ['./ffff.component.css']
})
export class FfffComponent implements OnInit {
    modalRef: BsModalRef;

    fieldTextType: boolean;
    repeatFieldTextType: boolean;

    loginForm: FormGroup;
    forgotPasswordForm: FormGroup;

    constructor(private _userService: UserService,
                private router: Router,
                private _sharingDataService: SharingDataService,
                private toastr: ToastrService,
                private modalService: BsModalService) { }

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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    closeModal() {
        this.modalRef.hide();
    }

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
                this.router.navigate(['/list-of-user-announcements']);
            },
            err => { 
                if(err.status == 400)
                {
                    this.toastr.error('Netačno korisničko ime ili lozinka.', 'Logovanje neuspješno.');
                }
                else
                {
                    console.log(err);
                }
            }
        );

        this.loginForm.reset();
        this.modalRef.hide();
    }

    onForgotPasswordSubmit(): void {
        //Call service for send instruction for reseting pasword on e-mail
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
