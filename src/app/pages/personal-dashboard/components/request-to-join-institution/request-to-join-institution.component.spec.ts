import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestToJoinInstitutionComponent } from './request-to-join-institution.component';

describe('RequestToJoinInstitutionComponent', () => {
  let component: RequestToJoinInstitutionComponent;
  let fixture: ComponentFixture<RequestToJoinInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestToJoinInstitutionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestToJoinInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
