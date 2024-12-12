import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects = new BehaviorSubject<Project[]>([
    {
      id: '1',
      name: 'تطوير الواجهة الأمامية',
      description: 'تطوير واجهة المستخدم الجديدة للتطبيق',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      status: 'active',
      members: ['أحمد', 'سارة', 'محمد']
    },
    {
      id: '2',
      name: 'تحسين الأداء',
      description: 'تحسين أداء التطبيق وتقليل وقت التحميل',
      startDate: new Date('2024-02-01'),
      status: 'active',
      members: ['خالد', 'ليلى']
    },
    {
      id: '3',
      name: 'توثيق API',
      description: 'توثيق شامل لواجهة برمجة التطبيقات',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-28'),
      status: 'completed',
      members: ['عمر', 'نور']
    }
  ]);

  getProjects(): Observable<Project[]> {
    return this.projects.asObservable();
  }

  addProject(project: Project): void {
    const currentProjects = this.projects.value;
    this.projects.next([...currentProjects, project]);
  }

  updateProject(updatedProject: Project): void {
    const currentProjects = this.projects.value;
    const updatedProjects = currentProjects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    );
    this.projects.next(updatedProjects);
  }

  deleteProject(projectId: string): void {
    const currentProjects = this.projects.value;
    const updatedProjects = currentProjects.filter(project => project.id !== projectId);
    this.projects.next(updatedProjects);
  }
}