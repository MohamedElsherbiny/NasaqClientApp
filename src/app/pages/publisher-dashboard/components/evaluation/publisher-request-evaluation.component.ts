import { Component, HostListener, OnInit } from '@angular/core';
import { RequestStatus } from '../../../../shared/models/RequestStatus';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { BookRequest } from '../../../../shared/models/BookRequest';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faEllipsisVertical,
  faPen,
  faTrash,
  faUsers,
  faCalendar,
  faCircle,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { PublisherBookRequestDetailsComponent } from "./request-evaluation-editor/request-evaluation-editor.component";

@Component({
  selector: 'app-publisher-request-evaluation',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PublisherBookRequestDetailsComponent],
  templateUrl: './publisher-request-evaluation.component.html',
  styleUrl: './publisher-request-evaluation.component.scss',
})
export class PublisherRequestEvaluationsComponent implements OnInit {
  RequestStatus = RequestStatus;
  requests: BookRequest[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  activeMenu: number | null = null;
  showForm = false;
  selectedBookRequest: BookRequest | null = null;

  // Font Awesome icons
  faPlus = faPlus;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;
  faUsers = faUsers;
  faCalendar = faCalendar;
  faCircle = faCircle;
  faEye = faEye;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchRequestsToEvaluate();
  }

  fetchRequestsToEvaluate(): void {
    this.http.get(`Requests/${this.user['publisherId']}/requests-to-evaluate`).subscribe({
      next: (response: any) => {
        this.requests = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch requests', error);
      },
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'on-hold': return 'معلق';
      default: return status;
    }
  }

  editBookRequest(request: BookRequest): void {
    this.selectedBookRequest = request;
    this.showForm = true;
    this.activeMenu = null;
  }

  closeForm(event: boolean): void {
    this.showForm = false;
    this.selectedBookRequest = null;
    if (event) {
      this.fetchRequestsToEvaluate();
    }
  }

  toggleMenu(event: Event, requestId: number): void {
    event.stopPropagation();
    this.activeMenu = this.activeMenu === requestId ? null : requestId;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.activeMenu = null;
  }
}
