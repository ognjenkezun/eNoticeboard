import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAllUsersComponent } from './list-of-all-users.component';

describe('ListOfAllUsersComponent', () => {
  let component: ListOfAllUsersComponent;
  let fixture: ComponentFixture<ListOfAllUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfAllUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfAllUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
