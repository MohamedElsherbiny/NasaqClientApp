import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Publisher, ServiceType } from '../../../../../shared/models/Publisher';
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
  @Output() close = new EventEmitter<boolean>();

  requestForm: FormGroup;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  books: Book[] = [];
  faTimes = faTimes;
  selectedServices: ServiceType[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
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

  getPublisherServiceTypes() {
    return this.publisher ? this.publisher.serviceTypes : [];
  }

  toggleServiceSelection(serviceType: any) {
    if (this.selectedServices.some((s) => s.serviceTypeId === serviceType.serviceTypeId)) {
      this.selectedServices = this.selectedServices.filter(
        (s) => s.serviceTypeId !== serviceType.serviceTypeId
      );
    } else {
      this.selectedServices.push(serviceType);
    }
  }

  isServiceSelected(serviceType: any): boolean {
    return this.selectedServices.some(
      (s) => s.serviceTypeId === serviceType.serviceTypeId
    );
  }


  onSubmit() {

    if (this.selectedServices.length === 0) {
      this.toastr.warning('يرجى اختيار خدمات قبل تقديم الطلب', 'تحذير');
      return;
    }

    const request = {
      bookId: this.requestForm.value.bookId,
      publisherId: this.publisher?.publisherId,
      authorId: this.user['authorId'],
      serviceTypeIds: this.selectedServices.map((service) => (service.serviceTypeId))
    };

    this.http.post(`Author/${this.user['authorId']}/requests`, request).subscribe({
      next: () => {
        this.toastr.success('تم إرسال الطلبات بنجاح', 'نجاح');
        // this.router.navigate(['/personal-dashboard/my-orders']);
        this.close.emit(true);
      },
      error: (error) => {
        console.error('Failed to create requests', error);
        this.toastr.error('فشل في إرسال الطلبات', 'خطأ');
      },
    });
  }

  onClose() {
    this.close.emit();
  }
}
