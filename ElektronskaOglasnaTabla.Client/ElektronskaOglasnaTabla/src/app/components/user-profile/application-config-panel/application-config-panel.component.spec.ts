import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationConfigPanelComponent } from './application-config-panel.component';

describe('ApplicationConfigPanelComponent', () => {
  let component: ApplicationConfigPanelComponent;
  let fixture: ComponentFixture<ApplicationConfigPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationConfigPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationConfigPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
