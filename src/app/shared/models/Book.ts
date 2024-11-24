import { BookDocument } from './BookDocument';

export interface Book {
  bookId?: number;
  title?: string;
  description?: string;
  isbn?: string;
  publicationDate?: string;
  documents?: BookDocument[];
}
