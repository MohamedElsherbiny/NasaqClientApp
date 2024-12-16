import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublisherRequestEvaluationsComponent } from './publisher-request-evaluation.component';


describe('PublisherRequestEvaluationsComponent', () => {
  let component: PublisherRequestEvaluationsComponent;
  let fixture: ComponentFixture<PublisherRequestEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherRequestEvaluationsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PublisherRequestEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
