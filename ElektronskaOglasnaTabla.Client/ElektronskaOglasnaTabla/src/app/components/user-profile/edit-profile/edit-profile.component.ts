import { Component, OnInit } from '@angular/core';
import { ValidationErrors, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  changePasswordForm: FormGroup;
  fieldTextType: boolean;
  repeatFieldTextType: boolean;

  constructor() { }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      'currentPassword': new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      'newPassword': new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      'confirmNewPassword': new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
    }, this.matchPassword('newPassword', 'confirmNewPassword'));
  }

  get currentPassword() { return this.changePasswordForm.get('currentPassword'); }

  get newPassword() { return this.changePasswordForm.get('newPassword'); }

  get confirmNewPassword() { return this.changePasswordForm.get('confirmNewPassword'); }

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

  onSubmit(): void {

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }
}
