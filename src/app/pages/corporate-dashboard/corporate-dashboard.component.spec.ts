import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateDashboardComponent } from './corporate-dashboard.component';

describe('CorporateDashboardComponent', () => {
  let component: CorporateDashboardComponent;
  let fixture: ComponentFixture<CorporateDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
