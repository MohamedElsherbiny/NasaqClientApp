import { ProjectService } from './ProjectService';
import { ProjectTask } from './ProjectTask';
import { RequestStatus } from './RequestStatus';

export interface Project {
  projectId: number;
  bookId: number;
  authorId: number;
  authorName: string;
  bookName: string;
  publisherId: number;
  publisherName: string;
  requstStatus: string;
  status: RequestStatus;
  projectDate: Date;
  projectServices: ProjectService[];
  projectTasks: ProjectTask[];
}