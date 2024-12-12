import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorBookEditorComponent } from './author-book-editor.component';

describe('AuthorBookEditorComponent', () => {
  let component: AuthorBookEditorComponent;
  let fixture: ComponentFixture<AuthorBookEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorBookEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorBookEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
