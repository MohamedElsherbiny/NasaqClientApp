import { Comment } from './comment.model';

export interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  collaborators: string[];
  projects: string[];
  tags: string[];
  completed: boolean;
  enabled: boolean;
  comments: Comment[];
}