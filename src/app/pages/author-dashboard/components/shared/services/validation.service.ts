import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  validateTask(task: Partial<Task>): string[] {
    const errors: string[] = [];

    if (!task.title?.trim()) {
      errors.push('عنوان المهمة مطلوب');
    } else if (task.title.length < 3) {
      errors.push('عنوان المهمة يجب أن يكون 3 أحرف على الأقل');
    }

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      if (dueDate < new Date()) {
        errors.push('تاريخ الاستحقاق يجب أن يكون في المستقبل');
      }
    }

    if (task.collaborators?.length === 0 && task.projects?.length === 0) {
      errors.push('يجب إضافة متعاون أو مشروع واحد على الأقل');
    }

    return errors;
  }
}