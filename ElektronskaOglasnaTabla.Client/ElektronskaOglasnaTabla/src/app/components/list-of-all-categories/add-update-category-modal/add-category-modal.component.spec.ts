import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCategoryModalComponent } from './add-update-category-modal.component';

describe('AddUpdateCategoryModalComponent', () => {
  let component: AddUpdateCategoryModalComponent;
  let fixture: ComponentFixture<AddUpdateCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
