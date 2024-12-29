import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { Book } from '../../../../shared/models/Book';
import { BookRequest } from '../../../../shared/models/BookRequest';
import { MetricsCardComponent } from "../../../publisher-dashboard/components/dashboard/metrics-card/metrics-card.component";
import { RequestCardComponent } from "../../../publisher-dashboard/components/dashboard/request-card/request-card.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricsCardComponent, RequestCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboard: any;
  books: Book[] = [];
  requests: BookRequest[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  currentDate = new Date();

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchDashboard();
    this.fetchBooks();
    this.fetchRequests();
  }

  fetchDashboard(): void {
    this.http
      .get(`Author/Dashboard`)
      .subscribe({
        next: (response: any) => {
          this.dashboard = response;
        },
        error: (error) => {
          console.error('Failed to fetch dashboard', error);
        },
      });
  }

  fetchBooks(): void {
    this.http.get(`Author/${this.user['authorId']}/books`).subscribe({
      next: (response: any) => {
        this.books = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch books', error);
      }
    });
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
