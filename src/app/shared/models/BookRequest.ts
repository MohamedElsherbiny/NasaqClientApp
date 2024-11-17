export interface BookRequest {
    requestId: number;
    bookId: number;
    authorId: number;
    status: string;
    authorName: string;
    bookName: string;
    publisherId: number;
    publisherName: string;
    requestDate: Date; 
}
