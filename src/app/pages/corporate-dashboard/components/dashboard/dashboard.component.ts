import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookRequest } from '../../../../shared/models/BookRequest';
import { Project } from '../../../../shared/models/Project';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboard: any;
  requests: BookRequest[] = [];
  projects: Project[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchDashboard();
    this.fetchRequests();
    this.fetchProjects();
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

  fetchProjects(): void {
    this.http.get(`Publisher/${this.user['publisherId']}/projects`).subscribe({
      next: (response: any) => {
        this.projects = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch projects', error);
      },
    });
  }
}
