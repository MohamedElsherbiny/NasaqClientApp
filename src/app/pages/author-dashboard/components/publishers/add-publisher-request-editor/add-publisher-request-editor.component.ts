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
    this.http.get(`Author/${this.user['authorId']}/books`, { pageNumber: 1, pageSize: 1000 }).subscribe({
      next: (response: any) => {
        this.books = response?.items || [];
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

  toggleServiceSelection(serviceType: ServiceType) {
    if (serviceType.serviceTypeId === 1) {
      // If serviceTypeId 1 is selected, clear all others and add only this one
      if (this.isServiceSelected(serviceType)) {
        // If already selected, unselect it
        this.selectedServices = this.selectedServices.filter(
          (s) => s.serviceTypeId !== serviceType.serviceTypeId
        );
      } else {
        // Otherwise, unselect all others and select this one
        this.selectedServices = [serviceType];
      }
    } else {
      // For other service types
      if (this.selectedServices.some((s) => s.serviceTypeId === serviceType.serviceTypeId)) {
        // If already selected, unselect it
        this.selectedServices = this.selectedServices.filter(
          (s) => s.serviceTypeId !== serviceType.serviceTypeId
        );
      } else {
        // Otherwise, check if serviceTypeId 1 is selected
        const serviceType1Index = this.selectedServices.findIndex((s) => s.serviceTypeId === 1);
        if (serviceType1Index !== -1) {
          // If serviceTypeId 1 is selected, remove it and add the new one
          this.selectedServices.splice(serviceType1Index, 1);
        }
        this.selectedServices.push(serviceType);
      }
    }
  }

  // Check whether a service is disabled
  isServiceDisabled(serviceType: ServiceType): boolean {
    const isServiceType1Selected = this.selectedServices.some((s) => s.serviceTypeId === 1);
    const isOtherServiceSelected = this.selectedServices.some((s) => s.serviceTypeId !== 1);
    if (serviceType.serviceTypeId === 1) {
      return isOtherServiceSelected; // Disable serviceTypeId 1 if any other is selected
    }
    return isServiceType1Selected; // Disable other services if serviceTypeId 1 is selected
  }

}
