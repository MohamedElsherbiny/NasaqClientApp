import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorRequestsComponent } from './author-requests.component';

describe('AuthorRequestsComponent', () => {
  let component: AuthorRequestsComponent;
  let fixture: ComponentFixture<AuthorRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
