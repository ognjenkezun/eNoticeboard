import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  //*ngIf=userDetails za prikazivanje profila
  userDetails;

  fieldTextType: boolean;
  repeatFieldTextType: boolean;

  loginForm: FormGroup;

  constructor(private _userService: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {

    /*if(localStorage.getItem('token') != null) {
      //this.router.navigateByUrl('/pocetna');
    }

    this._userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      }
    );*/

    this.loginForm = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }

  get email() { return this.loginForm.get('email'); }

  get password() {return this.loginForm.get('password'); }

  onSubmit(): void {
    //PROMIJENITI DUGME U LOGOUT
    /*console.warn(this.loginForm.value);
    this._userService.login(this.loginForm.value).subscribe(
      (res: any) => { 
        localStorage.setItem('token', res.token);
        //this.router.navigateByUrl('/user-profile');
       },
      err => { 
        if(err.status == 400)
        {
          this.toastr.error('Incorrect username or password.', 'Authentication failed.');
        }
        else
        {
          console.log(err);
        }
      }
    );*/

    this.loginForm.reset();
  }

  onLogout(): void {
    //PROMIJENITI DUGME U LOGIN
    //localStorage.removeItem('token');
    //this.router.navigate(['/pocetna']);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }
}
