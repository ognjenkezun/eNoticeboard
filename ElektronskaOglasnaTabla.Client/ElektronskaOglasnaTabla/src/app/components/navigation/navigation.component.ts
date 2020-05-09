import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/Users';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { Categories } from 'src/app/models/Categories';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  public listOfAllCategories = null as Categories[];
  //public isVisibleForUser: boolean;
  //public isVisibleForAdmin: boolean;
  public loggedUser: Users = null;
  public userLogged: boolean = null;

  constructor(private _categoryService: CategoryService) { 
    this.userLogged = true;
  }

  ngOnInit() {

    this.loadCategories();

    //this.isVisibleForUser = false;
    //this.isVisibleForAdmin = false;
  }

  loadCategories() {
    this._categoryService.getCategories().subscribe(data => {
      this.listOfAllCategories = data;
    });
  }

  logIn(loggedUser: Users): void{
    if(this.loggedUser.userTypeId){

    }
    else if(this.loggedUser.userTypeId){

    }
  }
}