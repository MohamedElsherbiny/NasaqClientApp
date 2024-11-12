import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePublisherEmployeeComponent } from './update-publisher-employee.component';

describe('UpdatePublisherEmployeeComponent', () => {
  let component: UpdatePublisherEmployeeComponent;
  let fixture: ComponentFixture<UpdatePublisherEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePublisherEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatePublisherEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
