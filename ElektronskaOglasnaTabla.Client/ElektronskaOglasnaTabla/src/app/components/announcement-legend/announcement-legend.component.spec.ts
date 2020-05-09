import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementLegendComponent } from './announcement-legend.component';

describe('AnnouncementLegendComponent', () => {
  let component: AnnouncementLegendComponent;
  let fixture: ComponentFixture<AnnouncementLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
