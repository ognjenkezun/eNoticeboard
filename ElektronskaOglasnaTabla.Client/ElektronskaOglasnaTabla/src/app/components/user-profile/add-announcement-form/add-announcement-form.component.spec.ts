import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnouncementFormComponent } from './add-announcement-form.component';

describe('AddAnnouncementFormComponent', () => {
  let component: AddAnnouncementFormComponent;
  let fixture: ComponentFixture<AddAnnouncementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnnouncementFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnnouncementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
