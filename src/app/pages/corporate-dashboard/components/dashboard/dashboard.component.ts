import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboard: any;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchDashboard();
  }

  fetchDashboard(): void {
    this.http
      .get(`Publisher/Dashboard`)
      .subscribe({
        next: (response: any) => {
          this.dashboard = response;
        },
        error: (error) => {
          console.error('Failed to fetch dashboard', error);
        },
      });
  }
}
