import { Book } from './Book';
import { ProjectTaskStatus } from './ProjectTaskStatus';
import { PublisherEmployee } from './PublisherEmployee';

export interface ProjectTask {
  projectTaskId?: number;
  taskName?: string;
  taskDescription?: string;
  taskStatus?: string;
  createdDate?: Date;
  status?: ProjectTaskStatus;
  assginTo?: PublisherEmployee;
  book?: Book,
  dueDate?: Date;
  predecessorId?: number;
  comments: Comment[];
}

export interface Comment {
  username: string;
  text: string;
  timestamp: Date;
}