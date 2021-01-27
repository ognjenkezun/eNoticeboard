import { Component, OnInit, TemplateRef } from '@angular/core';
import { Users } from 'src/app/models/Users';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { Categories } from 'src/app/models/Categories';
import { AnnouncementService } from 'src/app/services/announcement-service/announcement.service';
import { Announcements } from 'src/app/models/Announcements';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AnnouncementDetails } from 'src/app/models/AnnouncementDetails';
import { SharingDataService } from 'src/app/shared/sharing-data-service/sharing-data.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;

    modalRef: BsModalRef;
    loggedUserName: string;
    
    isUserLoggedIn: boolean;
    // isAdmin = false;
    isAdmin: boolean;

    isModalOpen: boolean;

    public listOfAllCategories = null as Categories[];
    public listOfAllAnnouncements = null as AnnouncementDetails[];
    //public isVisibleForUser: boolean;
    //public isVisibleForAdmin: boolean;
    public loggedUser: Users = null;
    public userLogged: boolean = false;
    public btnTxt: boolean = true;
    public klasa1: string = "fa fa-sign-in";
    public txt: string = "Prijavi se";
    public klasa: string = "btn-primary";
    public token: string = "";

    public ann = {} as Announcements;
    
    public model: Announcements;
    formatter = (announ: Announcements) => announ.announcementTitle;

    constructor(private _categoryService: CategoryService,
                private _announcementService: AnnouncementService,
                private _sharingDataService: SharingDataService,
                private _userService: UserService,
                private _router: Router,
                private _modalService: BsModalService) { 
    }
    
    ngOnInit() {
        this.isModalOpen = false;
        //this.token = "";
        this._announcementService.getAnnouncementsDetails().subscribe(data => {
            this.listOfAllAnnouncements = data;
        });

        // this._sharingDataService.user.subscribe();
        // // let role = localStorage.getItem('role');
        // // console.log("Role is: ", role);
        // // if(role == "Admin"){
        //     //     this.isAdmin = true;
        // // }
        
        this._sharingDataService.isLoggedIn.subscribe(data => {
            this.isUserLoggedIn = data;
            // console.log("ISLOGED ==============>>>>> ", data);
        });

        this._sharingDataService.isAdmin.subscribe(data => {
            this.isAdmin = data;
            // console.log("ISLOGED ==============>>>>> ", data);
        });

        this._sharingDataService.getUserName.subscribe(data => {
            this.loggedUserName = data;
        });


        // this.isLoggedIn$ = this._sharingDataService.isLoggedIn;
        // console.log("ISLOGED ==============>>>>> ", this.isLoggedIn$);
        // this._sharingDataService.loggedIn.subscribe(data => {
        //     this.lin = data;
        //     console.log("data ----------------------------", data);
        // });
        
        //this.isLoggedIn$ = this._sharingDataService.isLoggedIn;
        //console.log("isLoggedIn$ ------------------------", this.isLoggedIn$);
        //this.loggedUserName = localStorage.getItem('username');
        this.loadCategories();
        
        //this.isVisibleForUser = false;
        //this.isVisibleForAdmin = false;
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this._modalService.show(
            template,
            Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' })
        );
    }

    public closeModal() {
        this.modalRef.hide();
    }

    public onOpenModal(){
        this.isModalOpen = true;
    }

    public onCloseModal(){
        this.isModalOpen = false;
    }

    public search = (text$: Observable<string>) => text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter(term => term.length >= 1 ),
        map(term => this.listOfAllAnnouncements.filter(announ => new RegExp(term, 'mi').test(announ.announcementTitle)).slice(0, 10))
    );

    public loadCategories() {
        this._categoryService.getCategories().subscribe(data => {
            this.listOfAllCategories = data;
        });
    }

    //public onSignIn(): void {
    //    this.userLogged = true;
    //
    //       this._router.navigate(['/list-of-user-announcements']);
    //    }

    public onSignOut(): void {
        this.token = "";
        this._sharingDataService.logout();
        //this._sharingDataService.logout(false);
        //console.log("logout ------------------------------", this.isLoggedIn$);
        this._router.navigate(['/home']);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        this._userService.logout().subscribe();
        this._router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
    }

    public selectedItem(event: any): void {
        this._router.navigate(['/announcement', event.item.announcementId]);
    }
}