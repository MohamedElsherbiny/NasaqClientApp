import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { BookRequest } from '../../../../shared/models/BookRequest';
import { CommonModule } from '@angular/common';
import { RequestStatus } from '../../../../shared/models/RequestStatus';
import { DownloadFileComponent } from "../../../../shared/components/download-file/download-file.component";

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, DownloadFileComponent],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss',
})
export class OrderManagementComponent implements OnInit {
  RequestStatus = RequestStatus;
  requests: BookRequest[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  selectedRequestId: number | null = null;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.http.get(`Publisher/${this.user['publisherId']}/requests`).subscribe({
      next: (response: any) => {
        this.requests = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch requests', error);
      },
    });
  }

  approveRequest() {
    this.http
      .post(`Publisher/${this.user['publisherId']}/requests/approve`, {
        requestId: this.selectedRequestId,
      })
      .subscribe({
        next: () => {
          this.fetchRequests();
          this.selectedRequestId = null;
        },
        error: (error) => {
          console.error('Failed to approve the request', error);
        },
      });
  }

  rejectRequest() {
    this.http
      .post(`Publisher/${this.user['publisherId']}/requests/reject`, {
        requestId: this.selectedRequestId,
      })
      .subscribe({
        next: () => {
          this.fetchRequests();
          this.selectedRequestId = null;
        },
        error: (error) => {
          console.error('Failed to approve the request', error);
        },
      });
  }
}
