import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { Book } from '../../../../shared/models/Book';
import { MetricsCardComponent } from "./metrics-card/metrics-card.component";
import { RequestCardComponent } from "./request-card/request-card.component";
import { ProjectService } from '../publisher-projects/projects.service';

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
  currentDate = new Date();
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(private http: HttpService, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.fetchDashboard();
    this.projectService.fetchProjects();
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
