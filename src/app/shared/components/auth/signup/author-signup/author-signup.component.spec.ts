import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorSignupComponent } from './author-signup.component';

describe('AuthorSignupComponent', () => {
  let component: AuthorSignupComponent;
  let fixture: ComponentFixture<AuthorSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorSignupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
