import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment, faPaperPlane, faPen, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { ProjectTask } from '../../../../../shared/models/ProjectTask';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @Input() projectTask: ProjectTask | null = null;

  faTimes = faTimes;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faPen = faPen;
  faTrash = faTrash;
  constructor(private http: HttpService) { }
  ngOnInit(): void {
    this.fetchTaskComments();
  }

  fetchTaskComments(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http.get<Comment[]>(`Tasks/${user['publisherId']}/${this.projectTask?.projectTaskId}/comments`).subscribe({
      next: (response: Comment[]) => {
        this.comments = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch tasks', error);
      },
    });
  }

  comments: Comment[] = [{
    createdByName: 'أحمد',
    content: 'يجب أن نبدأ العمل على هذا في أقرب وقت ممكن',
    createdDate: new Date('2024-01-09T10:30:00')
  }];

  newCollaborator = '';
  newProject = '';
  newTag = '';
  newComment = '';
  editingText = '';

  editComment(index: number) {
    this.comments = this.comments?.map((comment, i) => {
      if (i === index) {
        this.editingText = comment.content;
        return { ...comment, isEditing: true };
      }
      return { ...comment, isEditing: false };
    });
  }

  deleteComment(index: number) {
    this.comments = this.comments?.filter((_, i) => i !== index);
  }

  saveComment(index: number) {
    if (this.editingText.trim()) {
      this.comments = this.comments?.map((comment, i) => {
        if (i === index) {
          return {
            ...comment,
            text: this.editingText.trim(),
            isEditing: false
          };
        }
        return comment;
      });
      this.editingText = '';
    }
  }

  cancelEdit(index: number) {
    this.comments = this.comments?.map((comment, i) => {
      if (i === index) {
        return { ...comment, isEditing: false };
      }
      return comment;
    });
    this.editingText = '';
  }

  addComment() {
    if (this.newComment.trim()) {
      const comment: Comment = {
        createdByName: 'أنت',
        content: this.newComment.trim(),
        createdDate: new Date()
      };

      this.comments = [
        ...(this.comments || []),
        comment
      ];
      this.newComment = '';

      this.createComment(comment);
    }
  }

  createComment(comment: Comment) {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http.post(`Tasks/${user['publisherId']}/${this.projectTask?.projectTaskId}/add-employee-comment`, {
      content: comment.content,
      taskId: this.projectTask?.projectTaskId
    }).subscribe({
      next: (response) => {
        console.log('Comment created successfully', response);
      },
      error: (error) => {
        console.error('Failed to create comment', error);
      }
    });
  }
}

export interface Comment {
  createdByName: string;
  content: string;
  createdDate: Date;
  isEditing?: boolean;
}