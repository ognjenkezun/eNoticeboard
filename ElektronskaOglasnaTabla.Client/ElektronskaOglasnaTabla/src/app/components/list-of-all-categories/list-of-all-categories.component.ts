import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/models/Categories';
import { CategoryService } from 'src/app/services/category-service/category.service';

@Component({
  selector: 'app-list-of-all-categories',
  templateUrl: './list-of-all-categories.component.html',
  styleUrls: ['./list-of-all-categories.component.css']
})
export class ListOfAllCategoriesComponent implements OnInit {

  public listOfAllCategories = null as Categories[];

  public searchText: string = null;
  public p: number = 1;
  public itmsPerPage: number = 5;

  constructor(private _categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this._categoryService.getCategories().subscribe(data => {
      this.listOfAllCategories = data;
      console.log(data);
    });
  }
}
