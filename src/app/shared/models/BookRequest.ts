import { Book } from './Book';
import { BookDocument } from './BookDocument';
import { RequestStatus } from './RequestStatus';

export interface BookRequest {
  requestId: number;
  bookId: number;
  authorId: number;
  authorName: string;
  bookName: string;
  documents: BookDocument[];
  book: Book;
  publisherId: number;
  publisherName: string;
  requestStatus: string;
  status: RequestStatus;
  requestDate: Date;
}
