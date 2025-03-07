import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { BookRequest } from '../../../../shared/models/BookRequest';
import { CommonModule } from '@angular/common';
import { RequestStatus } from '../../../../shared/models/RequestStatus';
import { faEllipsisVertical, faCheckCircle, faCancel, faPerson, faFileContract, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PublisherRequestEditorComponent } from "./publisher-request-editor/publisher-request-editor.component";
import { BookDocumentsComponent } from "../../../../shared/components/book-documents/book-documents.component";
import { RoleService } from '../../../../shared/core/services/role.service';
import { ProjectInvitationStatus } from '../../../../shared/models/ProjectInvitationStatus';

@Component({
  selector: 'app-publisher-requests',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PublisherRequestEditorComponent, BookDocumentsComponent],
  templateUrl: './publisher-requests.component.html',
  styleUrl: './publisher-requests.component.scss'
})
export class PublisherRequestsComponent implements OnInit {
  requests: BookRequest[] = [];
  RequestStatus = RequestStatus;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  selectedRequest: BookRequest | null = null;
  activeMenu: number | null = null;
  showForm = false;
  showCreateContractForm = false;
  showDocuments = false;

  // Font Awesome icons
  faEllipsisVertical = faEllipsisVertical;
  faCheckCircle = faCheckCircle;
  faCancel = faCancel;
  faPerson = faPerson;
  faFileContract = faFileContract;
  faDownload = faDownload;

  constructor(private http: HttpService, public roleService: RoleService) { }

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.http.get(`Requests/${this.user['publisherId']}`).subscribe({
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

  editRequest(request: BookRequest): void {
    this.selectedRequest = request;
    this.showForm = true;
    this.activeMenu = null;
  }

  closeForm(event: boolean): void {
    this.showForm = false;
    this.selectedRequest = null;
    if (event) {
      this.fetchRequests();
    }
  }
  updateInvitationStatus(invitationId: number, status: ProjectInvitationStatus) {
    this.http
      .post(`Projects/${invitationId}/UpdateStatus/${status}`, {  })
      .subscribe({
        next: () => {
          this.fetchRequests();
        },
        error: (error) => {
          console.error('Failed to approve the request', error);
        },
      });
  }

  approveRequest(request: BookRequest): void {
    if (request.isInvitation) {
      this.updateInvitationStatus(request.requestId, ProjectInvitationStatus.Accepted);
      return;
    }

    this.http
      .post(`Requests/${this.user['publisherId']}/approve`, { requestId: request.requestId })
      .subscribe({
        next: () => {
          this.fetchRequests();
        },
        error: (error) => {
          console.error('Failed to approve the request', error);
        },
      });
  }

  rejectRequest(request: BookRequest): void {
    if (request.isInvitation) {
      this.updateInvitationStatus(request.requestId, ProjectInvitationStatus.Rejected);
      return;
    }

    this.http
      .post(`Requests/${this.user['publisherId']}/reject`, { requestId: request.requestId })
      .subscribe({
        next: () => {
          this.fetchRequests();
        },
        error: (error) => {
          console.error('Failed to approve the request', error);
        },
      });
  }

  closeDocuments(): void {
    this.showDocuments = false;
    this.selectedRequest = null;
  }

  openDocuments(request: BookRequest): void {
    this.showDocuments = true;
    this.selectedRequest = request;
  }
}
