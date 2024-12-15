import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemEditorComponent } from './task-item-editor.component';

describe('TaskItemEditorComponent', () => {
  let component: TaskItemEditorComponent;
  let fixture: ComponentFixture<TaskItemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
