import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherRequestEditorComponent } from './publisher-request-editor.component';

describe('PublisherRequestEditorComponent', () => {
  let component: PublisherRequestEditorComponent;
  let fixture: ComponentFixture<PublisherRequestEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherRequestEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublisherRequestEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
