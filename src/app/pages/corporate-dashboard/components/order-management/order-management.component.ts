import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { BookRequest } from '../../../../shared/models/BookRequest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent implements OnInit {
  requests: BookRequest[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(private http: HttpService) { }

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
      }
    });
  }
}
