import { RequestStatus } from './RequestStatus';

export interface BookRequest {
  requestId: number;
  bookId: number;
  authorId: number;
  authorName: string;
  bookName: string;
  publisherId: number;
  publisherName: string;
  requstStatus: string;
  status: RequestStatus;
  requestDate: Date;
}
