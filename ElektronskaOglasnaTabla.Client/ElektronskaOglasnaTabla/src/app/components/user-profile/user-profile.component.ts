import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordModel } from 'src/app/models/ChangePasswordModel';
import { Users } from 'src/app/models/Users';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    fieldTextType: boolean;
    repeatFieldTextType: boolean;

    modalRefChangePassword: BsModalRef;
    modalRefUpdateProfile: BsModalRef;

    userProfile = {} as Users;
    changePassword = {} as ChangePasswordModel;

    changePasswordForm: FormGroup;
    editPersonalDataForm: FormGroup;

    constructor(private _userService: UserService,
                private _toastrService: ToastrService,
                private _modalService: BsModalService) { }

    ngOnInit(): void {
        this.changePasswordForm = new FormGroup({
            'oldPassword': new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ]),
            'passwords': new FormGroup({
                'newPassword': new FormControl('', [
                    Validators.required,
                    Validators.minLength(8)
                ]),
                'confirmNewPassword': new FormControl('', [
                    Validators.required,
                    Validators.minLength(8)
                ]),
            }, this.matchPassword("newPassword", "confirmNewPassword"))
        });
        
        this.editPersonalDataForm = new FormGroup({
            'firstName': new FormControl('', Validators.required),
            'lastName': new FormControl('', Validators.required),
            'email': new FormControl('', [
                Validators.required,
                Validators.email
            ])
        });

        this._modalService.onHide.subscribe(() => {
            if (this.editPersonalDataForm.dirty) {
                this.editPersonalDataForm.reset();
            }
            if (this.editPersonalDataForm.dirty) {
                this.editPersonalDataForm.reset();
            }
        });

        this.getUserProfile();
    }

    get oldPassword() { return this.changePasswordForm.get('oldPassword'); }
    get newPassword() { return this.changePasswordForm.get('passwords').get('newPassword'); }
    get confirmNewPassword() { return this.changePasswordForm.get('passwords').get('confirmNewPassword'); }

    get firstName() { return this.editPersonalDataForm.get('firstName'); }
    get lastName() { return this.editPersonalDataForm.get('lastName'); }
    get email() { return this.editPersonalDataForm.get('email'); }

    public onChangePasswordSubmit(): void {
        this.changePassword.currentPassword = this.oldPassword.value;
        this.changePassword.newPassword = this.newPassword.value;
        this.changePassword.confirmNewPassword = this.confirmNewPassword.value;

        console.log("Change password model => ", this.changePassword);
        

        this._userService.changePassword(this.changePassword).subscribe(succ => {
            this._toastrService.success("Uspješna promjena lozinke.", "Akcija uspješna");
            
            this.changePassword = null;
            this.changePasswordForm.reset();
        }, err => {
            this._toastrService.error(err, "Akcija nije uspjela");
        });
    }

    openModalChangePassword(template: TemplateRef<any>) {
        this.modalRefChangePassword = this._modalService.show(
            template,
            Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' })
        );
    }

    closeModalChangePassword() {
        this.modalRefChangePassword.hide();
    }

    openModalUpdateProfile(template: TemplateRef<any>) {
        this.returnUserProfileData();
        this.modalRefUpdateProfile = this._modalService.show(
            template,
            Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' })
        );
    }

    closeModalUpdateProfile() {
        this.modalRefUpdateProfile.hide();
    }

    public onEditPersonalDataSubmit(editPersonalDataForm: FormGroup): void {
        console.log("Form data from edit => ", editPersonalDataForm);
        this.userProfile.firstName = this.firstName.value;
        this.userProfile.lastName = this. lastName.value;
        this.userProfile.email = this.email.value;

        this._userService.editYourSelfProfile(this.userProfile).subscribe(succ => {
            this._toastrService.success("Uspješna izmjena profila.", "Akcija uspješna");
            //this.userProfile = null;
            this.editPersonalDataForm.reset();
            this.getUserProfile();
            this.closeModalUpdateProfile();
        }, err => {
            this._toastrService.error(err, "Akcija nije uspjela");
        });
    }

    public getUserProfile(): void {
        this._userService.getUserProfile().subscribe(data => {
            this.userProfile = data;
        });
    }

    public returnUserProfileData(): void {
        this.editPersonalDataForm.controls['firstName'].setValue(this.userProfile.firstName);
        this.editPersonalDataForm.controls['lastName'].setValue(this.userProfile.lastName);
        this.editPersonalDataForm.controls['email'].setValue(this.userProfile.email);
    }

    public matchPassword(password: string, confirmPassword: string): ValidationErrors | null {
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

    public toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }

    public toggleRepeatFieldTextType() {
        this.repeatFieldTextType = !this.repeatFieldTextType;
    }
}
