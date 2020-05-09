import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfUserAnnouncemenetsComponent } from './list-of-user-announcemenets.component';

describe('ListOfUserAnnouncemenetsComponent', () => {
  let component: ListOfUserAnnouncemenetsComponent;
  let fixture: ComponentFixture<ListOfUserAnnouncemenetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfUserAnnouncemenetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfUserAnnouncemenetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
