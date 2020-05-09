import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterPanelComponent } from './login-register-panel.component';

describe('LoginRegisterPanelComponent', () => {
  let component: LoginRegisterPanelComponent;
  let fixture: ComponentFixture<LoginRegisterPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginRegisterPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRegisterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
