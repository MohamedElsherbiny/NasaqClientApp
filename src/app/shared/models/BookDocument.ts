import { BaseEntityDto } from './BaseEntityDto';

export interface BookDocument extends BaseEntityDto {
  documentId?: number;
  documentName?: string;
  version?: string;
  file?: string;
}
