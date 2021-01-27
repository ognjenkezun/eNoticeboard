import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvDisplayComponent } from './tv-display.component';

describe('TvDisplayComponent', () => {
  let component: TvDisplayComponent;
  let fixture: ComponentFixture<TvDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
