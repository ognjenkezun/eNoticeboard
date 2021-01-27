import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAnnouncementsComponent } from './list-of-announcements.component';

describe('ListOfAnnouncementsComponent', () => {
  let component: ListOfAnnouncementsComponent;
  let fixture: ComponentFixture<ListOfAnnouncementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfAnnouncementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
