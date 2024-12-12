import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorProjectsComponent } from './author-projects.component';


describe('AuthorProjectsComponent', () => {
  let component: AuthorProjectsComponent;
  let fixture: ComponentFixture<AuthorProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorProjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
