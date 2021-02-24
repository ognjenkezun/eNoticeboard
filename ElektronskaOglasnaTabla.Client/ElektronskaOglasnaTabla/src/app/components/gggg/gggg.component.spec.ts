import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GgggComponent } from './gggg.component';

describe('GgggComponent', () => {
  let component: GgggComponent;
  let fixture: ComponentFixture<GgggComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GgggComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GgggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
