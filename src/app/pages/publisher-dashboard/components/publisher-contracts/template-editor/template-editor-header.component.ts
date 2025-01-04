import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contarct-template-editor-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="editor-header">
      <div></div>
      <button class="save-btn" (click)="save.emit()">حفظ القالب</button>
    </div>
  `,
  styles: [`
    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    h2 {
      color: var(--text-color);
      margin: 0;
    }

    .save-btn {
      background: #4573d2;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .save-btn:hover {
      background: #3b63b8;
    }
  `]
})
export class ContarctTemplateEditorHeaderComponent {
  @Output() save = new EventEmitter<void>();
}