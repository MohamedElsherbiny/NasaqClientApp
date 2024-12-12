import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Publisher } from '../../../../../shared/models/Publisher';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Book } from '../../../../../shared/models/Book';

@Component({
  selector: 'app-add-publisher-request-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
  providers: [HttpService],
  templateUrl: './add-publisher-request-editor.component.html',
  styleUrl: './add-publisher-request-editor.component.scss'
})
export class AddPublisherRequestEditorComponent implements OnInit {
  @Input() publisher: Publisher | null = null;
  @Output() close = new EventEmitter<void>();

  requestForm: FormGroup;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  books: Book[] = [];
  faTimes = faTimes;

  constructor(
    private fb: FormBuilder,
    private http: HttpService
  ) {
    this.requestForm = this.fb.group({
      publisherName: [''],
      bookId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.requestForm.patchValue({ publisherName: this.publisher?.companyName });
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.http.get(`Author/${this.user['authorId']}/books`).subscribe({
      next: (response: any) => {
        this.books = response || [];
        this.requestForm.patchValue({ bookId: this.books[0]?.bookId });
      },
      error: (error) => {
        console.error('Failed to fetch books', error);
      }
    });
  }

  onSubmit() {
    alert(this.requestForm.value.bookId);
  }
  onClose() {
    this.close.emit();
  }
}
