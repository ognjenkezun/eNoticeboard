import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheMostImportantAnnouncementComponent } from './the-most-important-announcement.component';

describe('TheMostImportantAnnouncementComponent', () => {
  let component: TheMostImportantAnnouncementComponent;
  let fixture: ComponentFixture<TheMostImportantAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheMostImportantAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheMostImportantAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
