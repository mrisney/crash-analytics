import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrossTabAnalysisComponent } from './crosstab-analysis.component';

describe('CrossTabAnalysisComponent', () => {
  let component: CrossTabAnalysisComponent;
  let fixture: ComponentFixture<CrossTabAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossTabAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossTabAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});