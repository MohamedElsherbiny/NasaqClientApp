import { BookDocument } from './BookDocument';

export interface Book {
  bookId?: number;
  wordCount: number;
  pageCount: number;
  title?: string;
  description?: string;
  isbn?: string;
  publicationDate?: string;
  documents?: BookDocument[];
}
