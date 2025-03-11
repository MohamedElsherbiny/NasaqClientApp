import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DEFAULT_EDITOR_CONFIG } from './editor.config';
import { ContarctTemplateEditorHeaderComponent } from "./template-editor-header.component";
import { Router } from '@angular/router';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { DEFAULT_CONTRACT_TEMPLATE } from './default-contract-template';

@Component({
  selector: 'app-contarct-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule, ContarctTemplateEditorHeaderComponent],
  template: `
    <div class="template-editor">
      <app-contarct-template-editor-header
        (save)="saveTemplate()"
      ></app-contarct-template-editor-header>

      <div class="editor-container">
        <editor
        apiKey="8lva9cmkskwxdn5efn0e2x683nk392djphq7o5r1gw4znch6"
          [init]="editorConfig"
          [(ngModel)]="content"
          (onInit)="handleEditorInit($event)"
        ></editor>
      </div>
    </div>
  `,
  styles: [`
    .template-editor {
      padding: 1.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-color);
    }

    .editor-container {
      flex: 1;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      overflow: hidden;
    }

    :host ::ng-deep .tox-tinymce {
      border: none !important;
    }
  `]
})
export class ContarctTemplateEditorComponent implements OnInit {
  content = DEFAULT_CONTRACT_TEMPLATE;

  editorConfig = DEFAULT_EDITOR_CONFIG;

  constructor(private router: Router, private http: HttpService) { }

  ngOnInit(): void {
    this.http.get('Publishers/Contracts/GetContractTemplate').subscribe({
      next: (response: any) => {
        debugger
        if (response.template) {
          this.content = response.template;
        }
      },
      error: (error) => {
        console.error('Failed to fetch contract template', error);
      }
    });
  }
  handleEditorInit(editor: any) {
    // save to database
  }

  saveTemplate() {
    this.http.post('Publishers/Contracts/UpdateContractTemplate', { template: this.content }).subscribe({
      next: () => {
        this.router.navigate(['/publisher-dashboard/contracts']);
      },

      error: () => {
      }
    });
  }
}