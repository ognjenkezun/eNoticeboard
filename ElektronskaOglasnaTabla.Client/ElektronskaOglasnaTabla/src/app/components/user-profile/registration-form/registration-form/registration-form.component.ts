import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';
import { Users } from 'src/app/models/Users';
import { UserTypes } from 'src/app/models/UserTypes';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-registration-form',
    templateUrl: './registration-form.component.html',
    styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
    @Output() closeModal: EventEmitter<null>;

    fieldTextType: boolean;
    repeatFieldTextType: boolean;

    registrationForm: FormGroup;
    user: Users;

    constructor(private _userService: UserService, private toastr: ToastrService) { 
        this.closeModal = new EventEmitter<null>();
    }

    ngOnInit() {
        this.registrationForm = new FormGroup({
            'firstName': new FormControl('',
                Validators.required
            ),
            'lastName': new FormControl('',
                Validators.required
            ),
            'email': new FormControl('', [
                Validators.required,
                Validators.email
            ]),
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
    }

    get firstName() { return this.registrationForm.get('firstName'); }

    get lastName() { return this.registrationForm.get('lastName'); }

    get email() { return this.registrationForm.get('email'); }

    get password() {return this.registrationForm.get('passwords').get('password'); }

    get confirmPassword() {return this.registrationForm.get('passwords').get('confirmPassword'); }

    onSubmit(): void {
        //console.warn(this.registrationForm.value);

        /*let user = {
            userId: undefined,
            userFirstName: this.registrationForm.get('firstName').value,
            userLastName: this.registrationForm.get('lastName').value,
            userPassword: this.registrationForm.get('passwords').get('password').value,
            userEmail: this.registrationForm.get('email').value,
            userTypeId: undefined,
            userType: undefined,
            announcements: undefined
        };*/

        //console.log(user);

        let userRegister = {
            UserName: this.registrationForm.get('email').value,
            FirstName: this.registrationForm.get('firstName').value,
            LastName: this.registrationForm.get('lastName').value,
            Email: this.registrationForm.get('email').value,
            Password: this.registrationForm.get('passwords').get('password').value
        };
        console.log(userRegister);
        this._userService.register(userRegister).subscribe(
            (res: any) => {
                if(res.succeeded){
                    this.registrationForm.reset();
                    this.toastr.success('New user created!', 'Registration successful.');
                    this.closeModal.emit();
                }
                else{
                    res.errors.forEach(element => {
                        switch(element.code){
                            case 'DuplicateUserName':
                                this.toastr.error('Username is already taken', 'Registration failed.');
                                break;
                            default:
                                this.toastr.error(element.description, 'Registration failed.');
                                break;
                        }
                    });
                }
            },
            err => {
                console.log(err);
            }
        );
        //this._userService.addUser(user).subscribe();
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

    comparePasswords(fb: FormGroup) {
        let confirmPswrdCtrl = this.registrationForm.get('passwords').get('confirmPassword');
        //passwordMismatch
        //confirmPswrdCtrl.errors={passwordMismatch:true}
        if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
            if (this.registrationForm.get('passwords').get('password').value != confirmPswrdCtrl.value)
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
