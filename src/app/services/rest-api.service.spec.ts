
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RestApiService } from './rest-api.service';
import { CrossTabAnalysisRequest } from '../shared/crosstab-analysis-request';
import { HttpClientModule } from '@angular/common/http';

describe('RestApiService', () => {
  let component: RestApiService;
  let fixture: ComponentFixture<RestApiService>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
          declarations: [RestApiService]
      }).compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(RestApiService);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
      expect(component).toBeTruthy();
  });
});