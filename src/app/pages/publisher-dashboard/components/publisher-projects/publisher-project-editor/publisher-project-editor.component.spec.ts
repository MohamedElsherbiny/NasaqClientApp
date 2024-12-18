import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherProjectEditorComponent } from './publisher-project-editor.component';

describe('PublisherProjectEditorComponent', () => {
  let component: PublisherProjectEditorComponent;
  let fixture: ComponentFixture<PublisherProjectEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherProjectEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublisherProjectEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
