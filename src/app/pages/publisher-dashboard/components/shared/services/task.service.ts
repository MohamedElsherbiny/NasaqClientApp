import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = new BehaviorSubject<Task[]>([
    {
      id: '1',
      title: 'إكمال توثيق المشروع',
      dueDate: new Date('2024-01-20'),
      collaborators: ['أحمد', 'سارة'],
      projects: ['التوثيق'],
      tags: ['أولوية عالية'],
      completed: false,
      enabled: true,
      comments: [
        {
          username: 'أحمد',
          text: 'يجب أن نبدأ العمل على هذا في أقرب وقت ممكن',
          timestamp: new Date('2024-01-09T10:30:00')
        }
      ]
    },
    {
      id: '2',
      title: 'مراجعة طلبات السحب',
      dueDate: new Date('2024-01-18'),
      collaborators: ['محمد'],
      projects: ['التطوير'],
      tags: ['مراجعة الكود'],
      completed: false,
      enabled: true,
      comments: []
    },
    {
      id: '3',
      title: 'تحديث المكتبات',
      dueDate: new Date('2024-01-25'),
      collaborators: [],
      projects: ['الصيانة'],
      tags: ['تقني'],
      completed: false,
      enabled: true,
      comments: []
    }
  ]);

  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable();
  }

  toggleTaskCompletion(taskId: string): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    this.tasks.next(updatedTasks);
  }

  addTask(task: Task): void {
    const currentTasks = this.tasks.value;
    this.tasks.next([...currentTasks, task]);
  }

  updateTask(updatedTask: Task): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasks.next(updatedTasks);
  }

  deleteTask(taskId: string): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    this.tasks.next(updatedTasks);
  }

  addComment(taskId: string, comment: Comment): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: [...task.comments, comment]
        };
      }
      return task;
    });
    this.tasks.next(updatedTasks);
  }

  reorderTasks(tasks: Task[]): void {
    this.tasks.next(tasks);
  }
}