export interface Comment {
  username: string;
  text: string;
  timestamp: Date;
  isEditing?: boolean;
}