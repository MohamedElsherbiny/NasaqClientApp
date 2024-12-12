import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteServiceProviderComponent } from './delete-service-provider.component';

describe('DeleteServiceProviderComponent', () => {
  let component: DeleteServiceProviderComponent;
  let fixture: ComponentFixture<DeleteServiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteServiceProviderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
