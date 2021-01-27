import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { Categories } from 'src/app/models/Categories';
import { PriorityService } from 'src/app/services/priority-service/priority.service';
import { Priorities } from 'src/app/models/Priorities';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-category-modal',
  templateUrl: './add-update-category-modal.component.html',
  styleUrls: ['./add-update-category-modal.component.css']
})
export class AddUpdateCategoryModalComponent implements OnInit {

  @Input() inputCategory?: Categories = null;
  @Input() action: string;

  public listOfAllPriorities = null as Priorities[];
  public selectedPriority = {} as Priorities;
  public selectedPriorityId: number;

  constructor(private _priorityService: PriorityService, 
              public _categoryService: CategoryService, 
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadPriorities();
    console.log(this.inputCategory);
    if(this.inputCategory != null){
      this._categoryService.formModel.controls['CategoryName'].setValue(this.inputCategory.categoryName);
      this._categoryService.formModel.controls['PriorityName'].setValue(this.inputCategory.priorityId); 
    }
  }

  loadPriorities() {
    this._priorityService.getPriorities().subscribe(data => {
      this.listOfAllPriorities = data;
    });
  }
  
  clearFormValue() {
    this._categoryService.formModel.reset();
  }

  onSubmit(){
    if(this.action === "add"){
      console.log("add");
      this.addNewCategory();
    }
    else if(this.action === "update") {
      console.log("update");
    }
    //Postaviti fleg da se zna je li update ili add
    console.log(this._categoryService.formModel.value);
    this._categoryService.formModel.reset();
  }

  public addNewCategory(): void {

    let newCat = {
      categoryName: this._categoryService.formModel.controls['CategoryName'].value,
      priorityId: this.selectedPriorityId
    }

    console.log(newCat);

    this._categoryService.addCategory(newCat).subscribe(
      res => {
        this.toastr.success('Nova kategorija dodata!', 'Dodavanje uspješno.');
      },
      err => {
        this.toastr.error(err.errors, 'Dodavanje nije uspjelo.');
        console.log(err);
    });
  }
}
