import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordModel } from 'src/app/models/ResetPasswordModel';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    fieldTextType: boolean;
    repeatFieldTextType: boolean;

    resetPasswordForm: FormGroup;
    resetPasswordData = {} as ResetPasswordModel;

    token: string;
    email: string;

    constructor(private _userService: UserService,
                private _toastr: ToastrService,
                private _route: ActivatedRoute,
                private _router: Router) { }

    ngOnInit(): void {
        this.resetPasswordForm = new FormGroup({
            'passwords': new FormGroup({
                'password': new FormControl('', [
                    Validators.required,
                    Validators.minLength(8)
                ]),
                'confirmPassword': new FormControl('', [
                    Validators.required,
                    Validators.minLength(8)
                ]),
            }, this.matchPassword("password", "confirmPassword"))
        });

        this._route.queryParams.subscribe(params => {
            this.token = params['token'];
            this.email = params['email'];
        });

        //this.token.replace(" ", "");

        console.log("Token => ", this.token);
        console.log("Email => ", this.email);
    }

    get password() { return this.resetPasswordForm.get('passwords').get('password'); }

    get confirmPassword() { return this.resetPasswordForm.get('passwords').get('confirmPassword'); }

    onResetPasswordFormSubmit(): void {
        this.resetPasswordData.password = this.resetPasswordForm.get('passwords').get('password').value;
        this.resetPasswordData.confirmPassword = this.resetPasswordForm.get('passwords').get('confirmPassword').value;
        this.resetPasswordData.email = this.email;
        this.resetPasswordData.token = this.token;

        console.log(this.resetPasswordData);
        
        this._userService.resetPassword(this.resetPasswordData).subscribe(succ => {
            console.log(succ);
            this._toastr.success("Lozinka usješno resetovana.", "Uspješna akcija.");
            this.resetPasswordForm.reset();
    
            this.token = null;
            this.email = null;
            
            this._router.navigate(['home']);
        }, err => {
            console.log(err);
            this._toastr.error("Lozinka nije resetovana. Pokušajte ponovo.", "Dogodila se greška.");
        });
    }

    matchPassword(password: string, confirmPassword: string): ValidationErrors | null {
        return (formGroup: FormGroup) => {
            const passwordControl = formGroup.controls[password];
            const confirmPasswordControl = formGroup.controls[confirmPassword];

            if (!passwordControl || !confirmPasswordControl) {
                return null;
            }

            if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
                return null;
            }

            if (passwordControl.value !== confirmPasswordControl.value) {
                confirmPasswordControl.setErrors({ passwordMismatch: true });
            } else {
                confirmPasswordControl.setErrors(null);
            }
        }
    }

    comparePasswords() {
        let confirmPswrdCtrl = this.resetPasswordForm.get('passwords').get('confirmPassword');
        if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
            if (this.resetPasswordForm.get('passwords').get('password').value != confirmPswrdCtrl.value)
                confirmPswrdCtrl.setErrors({ passwordMismatch: true });
            else
                confirmPswrdCtrl.setErrors(null);
        }
    }

    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }

    toggleRepeatFieldTextType() {
        this.repeatFieldTextType = !this.repeatFieldTextType;
    }
}
