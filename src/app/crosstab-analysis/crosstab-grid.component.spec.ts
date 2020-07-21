import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrossTabGridComponent } from './crosstab-grid.component';

describe('CrossTabGridComponent', () => {
  let component: CrossTabGridComponent;
  let fixture: ComponentFixture<CrossTabGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossTabGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossTabGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});