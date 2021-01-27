import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheLatestComponent } from './the-latest.component';

describe('TheLatestComponent', () => {
  let component: TheLatestComponent;
  let fixture: ComponentFixture<TheLatestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheLatestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheLatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
