import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FfffComponent } from './ffff.component';

describe('FfffComponent', () => {
  let component: FfffComponent;
  let fixture: ComponentFixture<FfffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FfffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FfffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
