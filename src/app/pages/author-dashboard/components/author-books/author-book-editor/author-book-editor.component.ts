import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Book } from '../../../../../shared/models/Book';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-book-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
  providers: [HttpService],
  templateUrl: './author-book-editor.component.html',
  styleUrl: './author-book-editor.component.scss'
})
export class AuthorBookEditorComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() close = new EventEmitter<boolean>();
  bookForm: FormGroup;
  selectedFile: File | null = null;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  fileError: boolean = false;

  faTimes = faTimes;
  targetAudiences = [
    { value: '5AB', label: 'Pre-school (0–5 years)' },
    { value: '5AC', label: 'Children’s (5–12 years)' },
    { value: '5AD', label: 'Teenage / Young Adult (12–18 years)' },
    { value: '5AM', label: 'Adult' },
  ];
  categories = [
    { value: 'F', label: 'Fiction' },
    { value: 'FA', label: 'Modern & contemporary fiction' },
    { value: 'FB', label: 'Classic fiction' },
    { value: 'FC', label: 'Crime & mystery' },
    { value: 'FD', label: 'Adventure fiction' },
    { value: 'FF', label: 'Science fiction' },
    { value: 'FG', label: 'Fantasy' },
    { value: 'FH', label: 'Horror & ghost stories' },
    { value: 'FJ', label: 'War & combat fiction' },
    { value: 'FK', label: 'Historical fiction' },
    { value: 'FL', label: 'Romance' },
    { value: 'FM', label: 'Erotic fiction' },
    { value: 'FP', label: 'Thriller / suspense' },
    { value: 'FQ', label: 'Humorous fiction' },
    { value: 'FR', label: 'Religious & spiritual fiction' },
    { value: 'FS', label: 'Family life fiction' },
    { value: 'FT', label: 'Short stories' },
    { value: 'FV', label: 'Narrative & experimental fiction' },

    { value: 'A', label: 'The Arts (art, photography, music, film, theater)' },
    { value: 'B', label: 'Biography, literature & literary studies' },
    { value: 'C', label: 'Language & linguistics' },
    { value: 'D', label: 'Society & social sciences (politics, law, education, sociology)' },
    { value: 'E', label: 'Economics, finance, business & management' },
    { value: 'G', label: 'Reference, information & interdisciplinary subjects' },
    { value: 'H', label: 'History & archaeology' },
    { value: 'J', label: 'Lifestyle, sport & leisure (cooking, health, self-help, crafts)' },
    { value: 'K', label: 'Mathematics & science' },
    { value: 'L', label: 'Medicine & nursing' },
    { value: 'M', label: 'Technology, engineering & agriculture' },
    { value: 'N', label: 'Earth sciences, geography, environment & planning' },
    { value: 'P', label: 'Philosophy & religion' },
    { value: 'Q', label: 'Psychology' },
    { value: 'R', label: 'Regional & national interest' },
    { value: 'T', label: 'Children’s, young adult & educational' },
    { value: 'U', label: 'Computing & information technology' },
    { value: 'V', label: 'English language teaching (ELT)' },
    { value: 'W', label: 'Transport, travel & tourism' },
    { value: 'X', label: 'Graphic novels, comics & manga' },
    { value: 'Y', label: 'Children’s fiction & non-fiction' },
    { value: 'Z', label: 'Unclassified' },

    // { value: '5AB', label: 'Pre-school (0–5 years)' },
    // { value: '5AC', label: 'Children’s (5–12 years)' },
    // { value: '5AD', label: 'Teenage / Young Adult (12–18 years)' },
    // { value: '5AM', label: 'Adult' },
    { value: '5AF', label: 'Educational / Academic' },
    { value: '5AG', label: 'Professional / Technical' },
    { value: '5AL', label: 'ELT / English as a Second Language' },
    { value: '5AP', label: 'General / Trade' },
    { value: '5AQ', label: 'Specialist / Niche Interest' },
    { value: '5AR', label: 'Research & Scholarly' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isbn: [''],
      publicationDate: [''],
      authorOne: ['', Validators.required],
      authorTwo: [''],
      authorThree: [''],
      category: [''],
      hasPublishedBefore: [''],
      previousPublisherName: [''],
      hasClearedBefore: [''],
      depositNumber: [''],
      targetAudience: [''],
      authorDescription: ['']
    });
  }
  ngOnInit(): void {
    if (this.book) {
      this.bookForm.patchValue({
        ...this.book,
        publicationDate: this.book.publicationDate?.split('T')[0]
      });
    }

    this.bookForm.get('hasPublishedBefore')?.valueChanges.subscribe(value => {
      if (value === 'yes') {
        this.bookForm.get('publicationDate')?.setValidators(Validators.required);
        this.bookForm.get('previousPublisherName')?.setValidators(Validators.required);
      } else {
        this.bookForm.get('publicationDate')?.clearValidators();
        this.bookForm.get('previousPublisherName')?.clearValidators();
      }
      this.bookForm.get('publicationDate')?.updateValueAndValidity();
      this.bookForm.get('previousPublisherName')?.updateValueAndValidity();
    });

    this.bookForm.get('hasClearedBefore')?.valueChanges.subscribe(value => {
      if (value === 'yes') {
        this.bookForm.get('depositNumber')?.setValidators(Validators.required);
      } else {
        this.bookForm.get('depositNumber')?.clearValidators();
      }
      this.bookForm.get('depositNumber')?.updateValueAndValidity();
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Check file type (only .doc and .docx allowed)
      if (file.type !== 'application/msword' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.fileError = true;
        this.selectedFile = null;
        this.toastr.error('يرجى اختيار ملف بصيغة .doc أو .docx فقط', 'خطأ');
      } else {
        this.selectedFile = file;
        this.fileError = false;
        this.bookForm.get('fileName')?.setValue(this.selectedFile.name);
      }
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.bookForm.get('title')?.value);
      formData.append('description', this.bookForm.get('description')?.value);
      formData.append('isbn', this.bookForm.get('isbn')?.value);
      formData.append('publicationDate', this.bookForm.get('publicationDate')?.value);
      formData.append('authorOne', this.bookForm.get('authorOne')?.value);
      formData.append('authorTwo', this.bookForm.get('authorTwo')?.value);
      formData.append('authorThree', this.bookForm.get('authorThree')?.value);
      formData.append('category', this.bookForm.get('category')?.value);
      formData.append('hasPublishedBefore', this.bookForm.get('hasPublishedBefore')?.value);
      formData.append('previousPublisherName', this.bookForm.get('previousPublisherName')?.value);
      formData.append('hasClearedBefore', this.bookForm.get('hasClearedBefore')?.value);
      formData.append('depositNumber', this.bookForm.get('depositNumber')?.value);
      formData.append('targetAudience', this.bookForm.get('targetAudience')?.value);
      formData.append('authorDescription', this.bookForm.get('authorDescription')?.value);

      formData.append('authorId', this.user['authorId']);
      formData.append('formFile', this.selectedFile, this.selectedFile.name);
      formData.append('fileName', this.selectedFile.name);

      if (this.book) {
        this.updateBook(formData);
      } else {
        this.createBook(formData);
      }
    } else {
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة', 'خطأ');
    }
  }

  private createBook(formData: FormData) {
    this.http.post(`Author/${this.user['authorId']}/book`, formData).subscribe({
      next: () => {
        this.toastr.success('تم إرسال الكتاب بنجاح', 'نجاح');
        this.bookForm.reset();
        this.selectedFile = null;
        this.close.emit(true);
      },
      error: (error) => {
        this.toastr.error('فشل في إرسال الكتاب، يرجى المحاولة مرة أخرى', 'خطأ');
      }
    });
  }

  private updateBook(formData: FormData) {
    this.http.put(`Author/${this.user['authorId']}/book/${this.book?.bookId}`, formData).subscribe({
      next: () => {
        this.toastr.success('تم تحديث الكتاب بنجاح', 'نجاح');
        this.bookForm.reset();
        this.selectedFile = null;
        this.close.emit(true);
      },
      error: (error) => {
        this.toastr.error('فشل في تحديث الكتاب، يرجى المحاولة مرة أخرى', 'خطأ');
      }
    });
  }
  removeFile(): void {
    this.selectedFile = null;
    this.bookForm.get('fileName')?.reset();
    this.fileError = false;
  }

  onClose() {
    this.close.emit();
  }
}
