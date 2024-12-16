import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublisherProjectDetailsComponent } from '../../publisher-projects/project-details/publisher-project-details.component';

describe('PublisherProjectDetailsComponent', () => {
  let component: PublisherProjectDetailsComponent;
  let fixture: ComponentFixture<PublisherProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherProjectDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublisherProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
