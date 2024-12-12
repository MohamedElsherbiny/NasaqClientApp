import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberEditorComponent } from './team-member-editor.component';

describe('TeamMemberEditorComponent', () => {
  let component: TeamMemberEditorComponent;
  let fixture: ComponentFixture<TeamMemberEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMemberEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamMemberEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
