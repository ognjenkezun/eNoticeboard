import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { Users } from 'src/app/models/Users';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserDetails } from 'src/app/models/UserDetails';
import { Router } from '@angular/router';
import { ForgotPasswordModel } from 'src/app/models/ForgotPasswordModel';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-list-of-all-users',
    templateUrl: './list-of-all-users.component.html',
    styleUrls: ['./list-of-all-users.component.css'],
    providers: [
        Ng2SearchPipeModule
    ]
})
export class ListOfAllUsersComponent implements OnInit {

    public listOfAllUsers = null as UserDetails[];
    public selectedUser = {} as Users;

    public searchText: string = null;

    modalRefAdd: BsModalRef;
    modalRefUpdate: BsModalRef;

    fieldTextType: boolean;
    repeatFieldTextType: boolean;

    addUserForm: FormGroup;
    editUserForm: FormGroup;
    user: Users;

    public selectedPage: number = 1;
    public itmsPerPage: number = 5;
    public totalUserItems: number;

    constructor(private _userService: UserService,
                private _toastrService: ToastrService,
                private _router: Router,
                private _modalService: BsModalService) { }

    ngOnInit(): void {
        this.loadUsers();

        this.editUserForm = new FormGroup({
            'firstName': new FormControl('',
                Validators.required
            ),
            'lastName': new FormControl('',
                Validators.required
            ),
            'role': new FormControl('', 
                Validators.required
            ),
            'email': new FormControl('', [
                Validators.email,
                Validators.required
            ])
        });
        
        this.addUserForm = new FormGroup({
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
            'role': new FormControl('', 
                Validators.required
            ),
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

        this._modalService.onHide.subscribe(() => {
            this.addUserForm.reset();
        });
    }

    loadUsers() {
        this._userService.getUsersPerPage(this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listOfAllUsers = data;
            console.log(data);
            this._userService.getNumberOfUsers().subscribe(data => {
                this.totalUserItems = data;
            });
        });
    }

    openModalAdd(template: TemplateRef<any>) {
        this.modalRefAdd = this._modalService.show(
            template,
            Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' })
        );
    }

    closeModalAdd() {
        this.modalRefAdd.hide();
    }

    openModalUpdate(template: TemplateRef<any>, row: any) {
        this.modalRefUpdate = this._modalService.show(
            template,
            Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' })
        );

        this.updateUser(row);
    }

    closeModalUpdate() {
        this.modalRefUpdate.hide();
    }

    retrunSelectedUser(row: any){
        this.selectedUser = row;
    }
    
    deleteUser(){
        this._userService.deleteUser(this.selectedUser.id).subscribe(res => {
            this._toastrService.success('Korisnik obrisan.', 'Akcija uspješna');
            console.log("Obavještenje obrisano");
            this.loadUsers();
        }, err => {
            this._toastrService.error(err, 'Akcija neuspješna');
        });
        this.selectedUser = null;
        //web socket
    }

    onAddUserSubmit(): void {
        let userRegister = {
            UserName: this.addUserForm.get('email').value,
            FirstName: this.addUserForm.get('firstName').value,
            LastName: this.addUserForm.get('lastName').value,
            Email: this.addUserForm.get('email').value,
            Password: this.addUserForm.get('passwords').get('password').value,
            Role: this.addUserForm.get('role').value
        };

        console.log(userRegister);
        this._userService.register(userRegister).subscribe(
            (res: any) => {
                if(res.succeeded){
                    this.addUserForm.reset();
                    this.loadUsers();
                    this._toastrService.success('New user created!', 'Registration successful.');
                    this.closeModalAdd();
                }
                // else{
                //     res.errors.forEach(element => {
                //         switch(element.code){
                //             case 'DuplicateUserName':
                //                 this.toastr.error('Username is already taken', 'Registration failed.');
                //                 break;
                //             default:
                //                 this.toastr.error(element.description, 'Registration failed.');
                //                 break;
                //         }
                //     });
                // }
            },
            err => {
                console.log("ERR => ", err);
                
                err.errors.forEach(element => {
                             switch(element.code){
                                 case 'DuplicateUserName':
                                     this._toastrService.error('Username is already taken', 'Registration failed.');
                                     break;
                                 default:
                                     this._toastrService.error(element.description, 'Registration failed.');
                                     break;
                             }
                         });
                //this._toastrService.error(err , 'Registration failed.');
            }
        );
    }

    onEditUserSubmit(): void {
        this.selectedUser.firstName = this.editUserForm.controls['firstName'].value;
        this.selectedUser.lastName = this.editUserForm.controls['lastName'].value;
        this.selectedUser.email = this.editUserForm.controls['email'].value;
        this.selectedUser.role = this.editUserForm.controls['role'].value;
        
        console.log("eeeeee", this.selectedUser);

        this._userService.editUser(this.selectedUser).subscribe(res => {
            this._toastrService.success('Izmjena nesupješna');
            this.loadUsers();
            this.editUserForm.reset();
            this.closeModalUpdate();
        }, err => {
            this._toastrService.error(err.errors, 'Izmjena nije uspjela.');
        });

        this.selectedUser = null;
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

    updateUser(user: Users): void {
        this.selectedUser = user;
        console.log("Selected user => ", user);
        this.editUserForm.controls['firstName'].setValue(user.firstName);
        this.editUserForm.controls['lastName'].setValue(user.lastName);
        this.editUserForm.controls['email'].setValue(user.email);
        this.editUserForm.controls['role'].setValue(user.role);
    }
    
    comparePasswords(fb: FormGroup) {
        let confirmPswrdCtrl = this.addUserForm.get('passwords').get('confirmPassword');
        //passwordMismatch
        //confirmPswrdCtrl.errors={passwordMismatch:true}
        if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
            if (this.addUserForm.get('passwords').get('password').value != confirmPswrdCtrl.value)
            confirmPswrdCtrl.setErrors({ passwordMismatch: true });
            else
            confirmPswrdCtrl.setErrors(null);
        }
    }

    resetPassword(user: Users): void {
        console.log("EMAIL => ", user.email);

        let forgotPassword = { 
            email: user.email
        };
        
        this._userService.getLinkForResetPassword(forgotPassword).subscribe(data => {
            console.log("Token => ", data.content);
            
            this._router.navigateByUrl(data.content);
            console.log("DATA => ", data);
        });
    }

    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }

    toggleRepeatFieldTextType() {
        this.repeatFieldTextType = !this.repeatFieldTextType;
    }

    selectPage(event: any) {
        this.selectedPage = event;
        console.log(event);
        window.scrollTo(0, 0);
        this.loadUsers();
    }

    onItemsPerPageChange(): void {
        this.selectedPage = 1;
        this.loadUsers();
        window.scrollTo(0, 0);
    }
}
