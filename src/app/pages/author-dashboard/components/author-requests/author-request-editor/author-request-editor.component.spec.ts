import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorRequestEditorComponent } from './author-request-editor.component';

describe('AuthorRequestEditorComponent', () => {
  let component: AuthorRequestEditorComponent;
  let fixture: ComponentFixture<AuthorRequestEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorRequestEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorRequestEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
