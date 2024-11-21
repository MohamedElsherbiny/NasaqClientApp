import { Component, OnInit } from '@angular/core';
import { RequestStatus } from '../../../../shared/models/RequestStatus';
import { BookRequest } from '../../../../shared/models/BookRequest';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../shared/models/Project';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss',
})
export class ProjectManagementComponent implements OnInit {
  RequestStatus = RequestStatus;
  projects: Project[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.fetchProjects();
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