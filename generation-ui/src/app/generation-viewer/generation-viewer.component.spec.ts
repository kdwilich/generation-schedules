import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationViewerComponent } from './generation-viewer.component';

describe('GenerationViewerComponent', () => {
  let component: GenerationViewerComponent;
  let fixture: ComponentFixture<GenerationViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerationViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerationViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
