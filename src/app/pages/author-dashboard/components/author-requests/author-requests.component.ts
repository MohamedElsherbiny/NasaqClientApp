import { Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { BookRequest } from '../../../../shared/models/BookRequest';
import { CommonModule } from '@angular/common';
import { RequestStatus } from '../../../../shared/models/RequestStatus';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faDownload,
  faEllipsisVertical,
  faPen,
  faTrash,
  faTable
} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { BookDocumentsComponent } from "../../../../shared/components/book-documents/book-documents.component";
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-author-requests',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, BookDocumentsComponent, MatPaginator],
  templateUrl: './author-requests.component.html',
  styleUrl: './author-requests.component.scss'
})
export class AuthorRequestsComponent implements OnInit {
  requests: BookRequest[] = [];
  selectedBookRequest: BookRequest | null = null;
  RequestStatus = RequestStatus;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  activeMenu: number | null = null;
  totalCount = 0
  searchQuery = ''
  pageIndex = 0
  pageSize = 4

  // Font Awesome icons
  faPlus = faPlus;
  faDownload = faDownload;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;
  faTable = faTable;
  showDocuments = false;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.http.get(`Author/${this.user['authorId']}/requests`, {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      keyword: this.searchQuery
    }).subscribe({
      next: (response: any) => {
        this.requests = response?.items || [];
        this.totalCount = response?.totalCount || 0;
      },
      error: (error) => {
        console.error('Failed to fetch requests', error);
      }
    });
  }

  toggleMenu(event: Event, bookId: number): void {
    event.stopPropagation();
    this.activeMenu = this.activeMenu === bookId ? null : bookId;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.activeMenu = null;
  }

  openDocuments(book: BookRequest): void {
    this.selectedBookRequest = book;
    this.showDocuments = true;
  }

  closeDocuments() {
    this.showDocuments = false;
    this.selectedBookRequest = null;
  }

  onPageChange(page: any): void {
    this.pageIndex = page.pageIndex;
    this.fetchRequests();
  }
}
