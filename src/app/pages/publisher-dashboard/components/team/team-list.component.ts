import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamMemberInviteComponent } from './team-member-invite.component';
import { FreelancerInviteModalComponent } from './freelancer-invite-modal.component';
import { ExternalFreelancerInviteComponent } from './external-freelancer-invite.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserPlus, faEnvelope, faUsers, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from '../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { PublisherEmployee } from '../../../../shared/models/PublisherEmployee';
import { EmployeeDetailsComponent } from './employee-details.component';
import { Publisher } from '../../../../shared/models/Publisher';
import { ActivatedRoute } from '@angular/router';

interface InviteData {
  emails: string[];
  role: string;
  services: string[];
}

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TeamMemberInviteComponent,
    FreelancerInviteModalComponent,
    ExternalFreelancerInviteComponent,
    FontAwesomeModule,
    EmployeeDetailsComponent
  ],
  template: `
    <div class="team-page">
      <div class="team-header">
        <h1>فريق العمل</h1>
        <div class="header-actions">
          <button class="invite-btn nasaq" (click)="showFreelancerModal = true">
            <fa-icon [icon]="faUsers"></fa-icon>
            دعوة من نسق
          </button>
          <button class="invite-btn external" (click)="showExternalForm = true">
            <fa-icon [icon]="faGlobe"></fa-icon>
            دعوة مستقل خارجي
          </button>
          <!-- <button class="invite-btn" (click)="showInviteForm = true">
            <fa-icon [icon]="faUserPlus"></fa-icon>
            دعوة عضو
          </button> -->
        </div>
      </div>

      <div class="team-list">
        <div class="member-card" *ngFor="let member of employees" (click)="showEmployeeDetails(member)">
          <div class="member-info">
            <div class="member-avatar" *ngIf="member.avatar">
              <img [src]="member.avatar" [alt]="member.name">
            </div>
            <div class="member-avatar" *ngIf="!member.avatar">
              {{ getInitials(member.name) }}
            </div>
            <div class="member-details">
              <h3>{{ member.name }}</h3>
              <div class="member-email">
                <fa-icon [icon]="faEnvelope"></fa-icon>
                {{ member.email }}
              </div>
             
            </div>
            
         
          </div>
        </div>

        <div class="member-card" *ngFor="let member of invitations" (click)="showInviteDetails(member)">
          <div class="member-info">
            <div class="member-avatar" *ngIf="member.individual.avatar">
              <img [src]="member.avatar" [alt]="member.individual.companyName">
            </div>
            <div class="member-avatar" *ngIf="!member.individual.avatar">
              {{ getInitials(member.individual.companyName) }}
            </div>
            <div class="member-details">
            <div class="row">
            <div class="col-8">
            <h3>{{ member.individual.companyName }}</h3>
            </div>
            <div class="col">
              <p *ngIf="member.status == 1">في انتظار الموافقة</p>
            </div>
            </div>
              <div class="member-email">
                <fa-icon [icon]="faEnvelope"></fa-icon>
                {{ member.individual.contactEmail }}
              </div>
             
            </div>
            
         
          </div>
      </div>
    </div>

    <app-team-member-invite
      *ngIf="showInviteForm"
      (close)="showInviteForm = false"
      (invite)="inviteMember($event)"
    ></app-team-member-invite>

    <app-employee-details
    *ngIf="showEmployeeDetailsModal"
      (close)="showEmployeeDetailsModal = false; selectedEmployee = null"
      [employee]="selectedEmployee"
    ></app-employee-details>
    <app-freelancer-invite-modal
      *ngIf="showFreelancerModal"
      (close)="showFreelancerModal = false"
      (invite)="inviteFreelancer($event)"
    ></app-freelancer-invite-modal>

    <app-external-freelancer-invite
      *ngIf="showExternalForm"
      (close)="showExternalForm = false"
      (invite)="inviteExternalFreelancer($event)"
    ></app-external-freelancer-invite>
  `,
  styles: [`
    .team-page {
      padding: 2rem;
      background: var(--bg-color);
    }

    .team-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .team-header h1 {
      color: var(--text-color);
      font-size: 1.5rem;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .invite-btn {
      background: #4573d2;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
    }

    .invite-btn:hover {
      background: #3b63b8;
    }

    .invite-btn.nasaq {
      background: #10b981;
    }

    .invite-btn.nasaq:hover {
      background: #059669;
    }

    .invite-btn.external {
      background: #8b5cf6;
    }

    .invite-btn.external:hover {
      background: #7c3aed;
    }

    .team-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .member-card {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: transform 0.2s;
    }

    .member-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .member-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--input-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-color);
      font-weight: 500;
      font-size: 1.1rem;
    }

    .member-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .member-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .member-details h3 {
      margin: 0;
      color: var(--text-color);
      font-size: 1.1rem;
    }

    .member-email {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-color);
      opacity: 0.7;
      font-size: 0.9rem;
    }

    .member-role {
      padding: 0.35rem 0.75rem;
      background: var(--input-bg);
      border-radius: 4px;
      color: var(--text-color);
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .team-page {
        padding: 1rem;
      }

      .header-actions {
        flex-wrap: wrap;
      }

      .invite-btn {
        flex: 1;
        justify-content: center;
      }
    }
  `]
})
export class TeamListComponent implements OnInit {
  showInviteForm = false;
  showFreelancerModal = false;
  showExternalForm = false;
  showEmployeeDetailsModal = false;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  employees: PublisherEmployee[] = [];
  invitations: any[] = [];
  selectedEmployee: PublisherEmployee | null = null;
  projectId: number | null = null;

  // Font Awesome icons
  faUserPlus = faUserPlus;
  faEnvelope = faEnvelope;
  faUsers = faUsers;
  faGlobe = faGlobe;

  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
      this.getInvitations(this.projectId);
    });
    // Load team members
    this.getEmployees()
  }

  getEmployees(): void {
    this.http.get<PublisherEmployee[]>(`Publisher/${this.user['publisherId']}/employees`).subscribe({
      next: (data) => {
        this.employees = data.filter(employee => !employee.isAdmin);
      },
      error: (error) => {
        this.toastr.error('فشل في تحميل قائمة الموظفين، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
      }
    });
  }

  getInvitations(projectId: number): void {
    this.http.get<any[]>(`Projects/${projectId}/Invitations`).subscribe({
      next: (data) => {
        this.invitations = data;
      },
      error: (error) => {
        this.toastr.error('فشل في تحميل قائمة الموظفين، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  showEmployeeDetails(selectedEmployee: PublisherEmployee) {
    this.selectedEmployee = selectedEmployee;
    this.showEmployeeDetailsModal = true;
  }

  showInviteDetails(invite: any) {
    this.selectedEmployee = {
      employeeId: 0,
      publisherId: invite.publisherId,
      name: '',
      roles: invite.individual.serviceTypes.map((x: any) => ({ name: x.name, value: x.serviceTypeId })),
    } as PublisherEmployee;

    this.showEmployeeDetailsModal = true;
  }

  inviteMember(data: InviteData): void {
    this.showInviteForm = false;

    this.http.post(`Projects/${this.projectId}/InviteExternals`, {
      emails: data.emails
    }).subscribe({
      next: (data) => {
        this.toastr.success('تم إرسال الدعوات بنجاح');
      },
      error: (error) => {
        this.toastr.error('فشل في إرسال الدعوات يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
      }
    });
    // TODO: Implement invitation logic
  }

  inviteFreelancer(freelancer: Publisher): void {
    this.http.post(`Projects/${this.projectId}/InviteIndividual/${freelancer.publisherId}`, {}).subscribe({
      next: (data) => {
        this.toastr.success('تم إرسال الدعوة بنجاح');
      },
      error: (error) => {
        this.toastr.error('فشل في إرسال الدعوة، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
      }
    });

    // Note: We don't close the modal to allow multiple invites
    // TODO: Implement freelancer invitation logic
  }

  inviteExternalFreelancer(data: InviteData): void {
    console.log('Inviting external freelancer:', data);
    this.showExternalForm = false;


    this.http.post(`Projects/${this.projectId}/InviteExternals`, {
      emails: data.emails
    }).subscribe({
      next: (data) => {
        this.toastr.success('تم إرسال الدعوات بنجاح');
      },
      error: (error) => {
        this.toastr.error('فشل في إرسال الدعوات يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
      }
    });
    // TODO: Implement external freelancer invitation logic
  }
}