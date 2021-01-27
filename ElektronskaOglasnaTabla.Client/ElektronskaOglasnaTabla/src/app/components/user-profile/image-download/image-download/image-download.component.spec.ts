import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDownloadComponent } from './image-download.component';

describe('ImageDownloadComponent', () => {
  let component: ImageDownloadComponent;
  let fixture: ComponentFixture<ImageDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
