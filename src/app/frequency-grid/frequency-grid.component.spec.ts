import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FrequencyGridComponent } from './frequency-grid.component';

describe('FrequencyGridComponent', () => {
  let component: FrequencyGridComponent;
  let fixture: ComponentFixture<FrequencyGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequencyGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
