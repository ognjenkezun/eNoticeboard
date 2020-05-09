import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { Users } from 'src/app/models/Users';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
  selector: 'app-list-of-all-users',
  templateUrl: './list-of-all-users.component.html',
  styleUrls: ['./list-of-all-users.component.css'],
  providers: [
    Ng2SearchPipeModule
  ]
})
export class ListOfAllUsersComponent implements OnInit {

  public listOfAllUsers = null as Users[];

  public searchText: string = null;
  public p: number = 1;
  public itmsPerPage: number = 5;

  constructor(private _userService: UserService) { }

  ngOnInit(): void {
    //this.loadUsers();
  }

  loadUsers() {
    this._userService.getUsers().subscribe(data => {
      this.listOfAllUsers = data;
      console.log(data);
    });
  }
}
