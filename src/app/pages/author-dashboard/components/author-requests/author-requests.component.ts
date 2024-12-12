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

@Component({
  selector: 'app-author-requests',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './author-requests.component.html',
  styleUrl: './author-requests.component.scss'
})
export class AuthorRequestsComponent implements OnInit {
  requests: BookRequest[] = [];
  RequestStatus = RequestStatus;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  activeMenu: number | null = null;

  // Font Awesome icons
  faPlus = faPlus;
  faDownload = faDownload;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;
  faTable = faTable;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.http.get(`Author/${this.user['authorId']}/requests`).subscribe({
      next: (response: any) => {
        this.requests = response || [];
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
}
