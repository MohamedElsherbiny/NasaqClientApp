import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../../../../shared/core/services/http.service';
import { Project } from '../../../../shared/models/Project';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    selectedProjectId = new BehaviorSubject<number>(0);
    private projects = new BehaviorSubject<Project[]>([]);

    constructor(private http: HttpService) {
        this.fetchProjects();
    }

    getProjects(): Observable<Project[]> {
        return this.projects.asObservable();
    }

    fetchProjects(): void {
        const user = JSON.parse(localStorage.getItem('user') ?? '{}');

        if (!user['publisherId']) { return; }

        this.http.get(`Publisher/${user['publisherId']}/projects`).subscribe({
            next: (response: any) => {
                this.projects.next(response || []);
            },
            error: (error) => {
                console.error('Failed to fetch projects', error);
            },
        });
    }

    setSelectedProjectId(selectedProjectId: any) {
        this.selectedProjectId.next(selectedProjectId);
    }
    //   this.projects.next([...currentProjects, project]);
}