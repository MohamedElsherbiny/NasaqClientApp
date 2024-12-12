import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../../../shared/core/services/http.service';
import { BookRequest } from '../../../../shared/models/BookRequest';
import { CommonModule } from '@angular/common';
import { RequestStatus } from '../../../../shared/models/RequestStatus';
import { DownloadFileComponent } from "../../../../shared/components/download-file/download-file.component";

@Component({
  selector: 'app-publisher-requests',
  standalone: true,
  imports: [RouterLink, CommonModule, DownloadFileComponent],
  templateUrl: './publisher-requests.component.html',
  styleUrl: './publisher-requests.component.scss'
})
export class PublisherRequestsComponent implements OnInit {
  requests: BookRequest[] = [];
  RequestStatus = RequestStatus;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

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
}
