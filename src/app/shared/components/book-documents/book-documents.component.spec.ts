import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDocumentsComponent } from './book-documents.component';

describe('BookDocumentsComponent', () => {
  let component: BookDocumentsComponent;
  let fixture: ComponentFixture<BookDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
