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
    { value: '5AB', label: 'ما قبل المدرسة (0-5 سنوات)' },
    { value: '5AC', label: 'الأطفال (5-12 سنة)' },
    { value: '5AD', label: 'المراهقون / الشباب (12-18 سنة)' },
    { value: '5AM', label: 'البالغون' },
  ];
  
  categories = [
    { value: 'F', label: 'الأدب الروائي' },
    { value: 'FA', label: 'الأدب المعاصر والحديث' },
    { value: 'FB', label: 'الأدب الكلاسيكي' },
    { value: 'FC', label: 'الروايات البوليسية والغموض' },
    { value: 'FD', label: 'روايات المغامرة' },
    { value: 'FF', label: 'الخيال العلمي' },
    { value: 'FG', label: 'الفانتازيا' },
    { value: 'FH', label: 'الرعب والقصص الأشباح' },
    { value: 'FJ', label: 'روايات الحرب والمعارك' },
    { value: 'FK', label: 'الروايات التاريخية' },
    { value: 'FL', label: 'الروايات الرومانسية' },
    { value: 'FM', label: 'الأدب الإيروتيكي' },
    { value: 'FP', label: 'التشويق والإثارة' },
    { value: 'FQ', label: 'الأدب الساخر والكوميدي' },
    { value: 'FR', label: 'الروايات الدينية والروحية' },
    { value: 'FS', label: 'روايات الحياة الأسرية' },
    { value: 'FT', label: 'القصص القصيرة' },
    { value: 'FV', label: 'الأدب السردي والتجريبي' },
  
    { value: 'A', label: 'الفنون (الرسم، التصوير، الموسيقى، السينما، المسرح)' },
    { value: 'B', label: 'السير الذاتية، الأدب والدراسات الأدبية' },
    { value: 'C', label: 'اللغة واللسانيات' },
    { value: 'D', label: 'المجتمع والعلوم الاجتماعية (السياسة، القانون، التعليم، علم الاجتماع)' },
    { value: 'E', label: 'الاقتصاد، المال، الأعمال والإدارة' },
    { value: 'G', label: 'المراجع، المعلومات والمواضيع متعددة التخصصات' },
    { value: 'H', label: 'التاريخ وعلم الآثار' },
    { value: 'J', label: 'أسلوب الحياة، الرياضة والترفيه (الطبخ، الصحة، المساعدة الذاتية، الحرف اليدوية)' },
    { value: 'K', label: 'الرياضيات والعلوم' },
    { value: 'L', label: 'الطب والتمريض' },
    { value: 'M', label: 'التكنولوجيا، الهندسة والزراعة' },
    { value: 'N', label: 'علوم الأرض، الجغرافيا، البيئة والتخطيط' },
    { value: 'P', label: 'الفلسفة والدين' },
    { value: 'Q', label: 'علم النفس' },
    { value: 'R', label: 'الاهتمامات الإقليمية والوطنية' },
    { value: 'T', label: 'كتب الأطفال، الشباب والتعليمية' },
    { value: 'U', label: 'الحوسبة وتكنولوجيا المعلومات' },
    { value: 'V', label: 'تعليم اللغة الإنجليزية (ELT)' },
    { value: 'W', label: 'النقل، السفر والسياحة' },
    { value: 'X', label: 'الروايات المصورة، القصص المصورة والمانجا' },
    { value: 'Y', label: 'أدب الأطفال (قصصي وغير قصصي)' },
    { value: 'Z', label: 'غير مصنف' },
  
    { value: '5AF', label: 'تعليمي / أكاديمي' },
    { value: '5AG', label: 'مهني / تقني' },
    { value: '5AL', label: 'تعليم اللغة الإنجليزية كلغة ثانية' },
    { value: '5AP', label: 'عام / تجاري' },
    { value: '5AQ', label: 'متخصص / اهتمام خاص' },
    { value: '5AR', label: 'بحثي وأكاديمي' }
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
