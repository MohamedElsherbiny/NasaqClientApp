import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Comment } from '../models/comment.model';
import { ProjectTask } from '../../../../../shared/models/ProjectTask';
import { ProjectTaskStatus } from '../../../../../shared/models/ProjectTaskStatus';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = new BehaviorSubject<ProjectTask[]>([
    // {
    //   projectTaskId: 1,
    //   taskName: 'إكمال توثيق المشروع',
    //   dueDate: new Date('2024-01-20'),
    //   taskDescription: 'يجب أن نبدأ العمل على هذا في أقرب وقت ممكن',
    //   taskStatus: 'قيد التقدم',
    //   createdDate: new Date('2024-01-05'),
    //   status: ProjectTaskStatus.InProgress,
    //   comments: [
    //     {
    //       username: 'أحمد',
    //       text: 'يجب أن نبدأ العمل على هذا في أقرب وقت ممكن',
    //       timestamp: new Date('2024-01-09T10:30:00')
    //     }
    //   ]
    // }
  ]);

  getTasks(): Observable<ProjectTask[]> {
    return this.tasks.asObservable();
  }

  toggleTaskCompletion(taskId: number): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.map(task =>
      task.projectTaskId === taskId ? { ...task, status: task.status === ProjectTaskStatus.InProgress ? ProjectTaskStatus.Completed : ProjectTaskStatus.InProgress } : task
    );
    this.tasks.next(updatedTasks);
  }

  addTask(task: ProjectTask): void {
    const currentTasks = this.tasks.value;
    this.tasks.next([...currentTasks, task]);
  }

  updateTask(updatedTask: ProjectTask): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.map(task =>
      task.projectTaskId === updatedTask.projectTaskId ? updatedTask : task
    );
    this.tasks.next(updatedTasks);
  }

  deleteTask(taskId: number): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.filter(task => task.projectTaskId !== taskId);
    this.tasks.next(updatedTasks);
  }

  addComment(taskId: number, comment: Comment): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.map(task => {
      if (task.projectTaskId === taskId) {
        return {
          ...task,
          comments: [...task.comments, comment]
        };
      }
      return task;
    });
    this.tasks.next(updatedTasks);
  }

  reorderTasks(tasks: ProjectTask[]): void {
    this.tasks.next(tasks);
  }
}