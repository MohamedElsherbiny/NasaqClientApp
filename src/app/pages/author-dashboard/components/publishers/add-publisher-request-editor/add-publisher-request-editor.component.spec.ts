import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPublisherRequestEditorComponent } from './add-publisher-request-editor.component';

describe('AddPublisherRequestEditorComponent', () => {
  let component: AddPublisherRequestEditorComponent;
  let fixture: ComponentFixture<AddPublisherRequestEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPublisherRequestEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPublisherRequestEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
