import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAllCategoriesComponent } from './list-of-all-categories.component';

describe('ListOfAllCategoriesComponent', () => {
  let component: ListOfAllCategoriesComponent;
  let fixture: ComponentFixture<ListOfAllCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfAllCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfAllCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
