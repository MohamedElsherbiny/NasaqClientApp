import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Publisher, ServiceType } from '../../../../../shared/models/Publisher';
import { Book } from '../../../../../shared/models/Book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-request-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, FormsModule, CommonModule],
  providers: [HttpService],
  templateUrl: './author-request-editor.component.html',
  styleUrls: ['./author-request-editor.component.scss']
})
export class AuthorRequestEditorComponent implements OnInit {
  publishers: Publisher[] = [];
  books: Book[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  selectedPublisherId: number | null = null;
  selectedBookId: number | null = null;
  selectedServices: ServiceType[] = [];

  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private router: Router,
  ) {

  }
  ngOnInit(): void {
    this.loadPublishers();
    this.fetchBooks();
  }

  private loadPublishers(): void {
    this.http.get<any>(`Publisher`).subscribe({
      next: (data) => {
        this.publishers = data;
      },
      error: () => this.toastr.error('فشل في تحميل البيانات', 'خطأ')
    });
  }

  fetchBooks(): void {
    this.http.get(`Author/${this.user['authorId']}/books`, { pageSize: 1000, pageNumber: 1 }).subscribe({
      next: (response: any) => {
        this.books = response?.items || [];
        this.selectedBookId = this.books[0]?.bookId ?? null;
      },
      error: (error) => {
        console.error('Failed to fetch books', error);
      }
    });
  }

  getPublisherServiceTypes() {
    const publisher = this.publishers.find(
      (p) => p.publisherId === this.selectedPublisherId
    );
    return publisher ? publisher.serviceTypes : [];
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

  onBookChange() {
    this.selectedServices = [];
  }

  addRequest() {
    if (!this.selectedPublisherId || !this.selectedBookId) {
      this.toastr.warning('يرجى اختيار دار نشر وكتاب أولاً', 'تحذير');
      return;
    }

    if (this.selectedServices.length === 0) {
      this.toastr.warning('يرجى اختيار خدمات قبل تقديم الطلب', 'تحذير');
      return;
    }

    const request = {
      bookId: this.selectedBookId,
      publisherId: this.selectedPublisherId,
      authorId: this.user['authorId'],
      serviceTypeIds: this.selectedServices.map((service) => (service.serviceTypeId))
    };

    this.http.post(`Author/${this.user['authorId']}/requests`, request).subscribe({
      next: () => {
        this.toastr.success('تم إرسال الطلبات بنجاح', 'نجاح');
        this.router.navigate(['/author-dashboard/author-request-editors']);
      },
      error: (error) => {
        console.error('Failed to create requests', error);
        this.toastr.error('فشل في إرسال الطلبات', 'خطأ');
      },
    });
  }
}