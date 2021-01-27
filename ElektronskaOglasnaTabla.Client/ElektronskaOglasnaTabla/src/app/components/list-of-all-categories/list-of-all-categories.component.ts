import { Component, OnInit, TemplateRef } from '@angular/core';
import { Categories } from 'src/app/models/Categories';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { PriorityService } from 'src/app/services/priority-service/priority.service';
import { Priorities } from 'src/app/models/Priorities';
import { CategoriesDetails } from 'src/app/models/CategoriesDetails';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-list-of-all-categories',
    templateUrl: './list-of-all-categories.component.html',
    styleUrls: ['./list-of-all-categories.component.css']
})
export class ListOfAllCategoriesComponent implements OnInit {

    public listOfAllCategories = null as CategoriesDetails[];
    public listOfAllPriorities = null as Priorities[];

    modalRefAdd: BsModalRef;
    modalRefUpdate: BsModalRef;

    public clickAction: string;
    public selectedPriorityId: number;

    public selectedPriority = {} as Priorities;
    public selectedCategory = {} as Categories;

    public searchText: string = null;

    public selectedPage: number = 1;
    public itmsPerPage: number = 5;
    public totalCatItems: number;

    constructor(public _categoryService: CategoryService, 
                private _priorityService: PriorityService,
                private _toastr: ToastrService,
                private _router: Router,
                private _modalService: BsModalService) { }

    ngOnInit(): void {
        this.loadCategories();
        this.loadPriorities();
        this._modalService.onHide.subscribe(() => {
            this._categoryService.formModel.reset();
        });
    }

    loadPriorities() {
        this._priorityService.getPriorities().subscribe(data => {
            this.listOfAllPriorities = data;
        });
    }
    // this._announcementService.getAnnouncementsDetailsPage(this.selectedPage, this.itmsPerPage).subscribe(data => {
    //     this.listOfUserAnnouncements = data;
    //     console.log(data);
    //     this._announcementService.getNumberOfAnnouncement().subscribe(data => {
    //         this.totalAnnItems = data;
    //         console.log(this.totalAnnItems)
    //     });
    // });

    loadCategories() {
        this._categoryService.getCategoriesDetailsPage(this.selectedPage, this.itmsPerPage).subscribe(data => {
            this.listOfAllCategories = data;
            console.log(data);
            this._categoryService.getNumberOfCategories().subscribe(data => {
                this.totalCatItems = data;
            });
        });
    }

    openModalAdd(template: TemplateRef<any>) {
        this.onAddNewClick();
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

        this.updateCategory(row);
    }

    closeModalUpdate() {
        this.modalRefUpdate.hide();
    }

    selectPage(event: any) {
        this.selectedPage = event;
        console.log(event);
        window.scrollTo(0, 0);
        this.loadCategories();
    }

    clearFormValue() {
        this._categoryService.formModel.reset();
    }

    onItemsPerPageChange(): void {
        this.selectedPage = 1;
        this.loadCategories();
        window.scrollTo(0, 0);
    }

    onAddNewClick(){
        this.clickAction = "add"
    }

    onSubmit(){
        if(this.clickAction === "add"){
            this.addNewCategory();
            console.log("add");
        }
        else if(this.clickAction === "update"){

            let updateCat = {
                categoryId: this.selectedCategory.categoryId,
                categoryName: this._categoryService.formModel.controls['CategoryName'].value,
                priorityId: this._categoryService.formModel.controls['PriorityName'].value
            }

            this._categoryService.editCategory(this.selectedCategory.categoryId, updateCat).subscribe(
                res => {
                    this._toastr.success('Izabrana kategorija je izmijenjena!', 'Izmjena uspješna.');
                    this.loadCategories();
                    this._categoryService.formModel.reset();
                    this.closeModalUpdate();
                },
                  err => {
                    this._toastr.error(err.errors, 'Dodavanje nije uspjelo.');
                    console.log(err);
                }
            );
        
            console.log(this._categoryService.formModel.value);
            this.selectedPriorityId = null;
            console.log("update");
        }
    }

    updateCategory(row: any) {
        this.clickAction = "update";
        console.log("click");
        this.selectedCategory = row;
        this._categoryService.formModel.controls['CategoryName'].setValue(this.selectedCategory.categoryName);
        this._categoryService.formModel.controls['PriorityName'].setValue(this.selectedCategory.priorityId);

        // this._categoryService.formModel = row;
        // this.selectedCategory.categoryId = row.categoryId;
        // this.selectedCategory.categoryName = row.categoryName;
        // this.selectedCategory.priorityId = row.priorityId;
        // console.log("Selected category: ");
        // console.log(this.selectedCategory);
        // console.log("Categorija izmijenjana");
    }

    returnSelectedCategory(row: any): void{
        this.selectedCategory = row;
        console.log(this.selectedCategory);
    }

    deleteCategory(row: any) {
        this.selectedCategory = row;
        console.log(row.announcementId);
        console.log("Kategorija obrisana");
        this._categoryService.deleteCategory(this.selectedCategory.categoryId).subscribe(
            res => {
                this._toastr.success('Izabrana kategorija je obrisana!', 'Brisanje uspješno.');
                this.loadCategories();
            },
            err => {
                this._toastr.error(err.errors, 'Brisanje nije uspjelo.');
                console.log(err);
            }
        );

        this.loadCategories();
        this.selectedPriorityId = null;
    }

    public addNewCategory(): void {

        let newCat = {
            categoryName: this._categoryService.formModel.controls['CategoryName'].value,
            priorityId: this._categoryService.formModel.controls['PriorityName'].value
        }

        console.log(newCat);

        this._categoryService.addCategory(newCat).subscribe(
            res => {
                this._toastr.success('Nova kategorija dodata!', 'Dodavanje uspješno.');
                this.loadCategories();
                this._categoryService.formModel.reset();
                this.closeModalAdd();
            },
            err => {
                this._toastr.error(err.errors, 'Dodavanje nije uspjelo.');
                console.log(err);
            }
        );
    }
}
