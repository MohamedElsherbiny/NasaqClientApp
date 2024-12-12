import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublisherProjectsComponent } from './publisher-projects.component';


describe('PublisherProjectsComponent', () => {
  let component: PublisherProjectsComponent;
  let fixture: ComponentFixture<PublisherProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherProjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublisherProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
