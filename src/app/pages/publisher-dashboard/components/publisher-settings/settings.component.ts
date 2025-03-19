import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractTemplatesComponent } from './contract-templates/contract-templates.component';
import { UsersComponent } from './users/users.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileContract, faUsers } from '@fortawesome/free-solid-svg-icons';
import { TeamComponent } from "../team/team.component";
import { PublisherContractsComponent } from "../publisher-contracts/publisher-contracts.component";

@Component({
  selector: 'app-publisher-settings',
  standalone: true,
  imports: [CommonModule, ContractTemplatesComponent, UsersComponent, FontAwesomeModule, TeamComponent, PublisherContractsComponent],
  template: `
    <div class="settings-page">
      <div class="settings-content">
        <div class="tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'templates'"
            (click)="activeTab = 'templates'"
          >
            <fa-icon [icon]="faFileContract"></fa-icon>
             العقود
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'users'"
            (click)="activeTab = 'users'"
          >
            <fa-icon [icon]="faUsers"></fa-icon>
            المستخدمون
          </button>
        </div>

        <div class="tab-content">
          <!-- <app-contract-templates *ngIf="activeTab === 'templates'"></app-contract-templates> -->
          <!-- <app-users *ngIf="activeTab === 'users'"></app-users> -->
           <app-publisher-contracts *ngIf="activeTab === 'templates'"></app-publisher-contracts>
          <app-team-management *ngIf="activeTab === 'users'"></app-team-management>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 2rem;
      background: var(--bg-color);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .settings-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .tabs {
      display: flex;
      gap: 1rem;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 2rem;
    }

    .tab-btn {
      padding: 1rem 2rem;
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      font-size: 1rem;
      position: relative;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .tab-btn::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #4573d2;
      transform: scaleX(0);
      transition: transform 0.2s;
    }

    .tab-btn.active {
      color: #4573d2;
    }

    .tab-btn.active::after {
      transform: scaleX(1);
    }

    .tab-content {
      flex: 1;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .settings-page {
        padding: 1rem;
      }

      .tabs {
        gap: 0.5rem;
      }

      .tab-btn {
        padding: 0.75rem 1rem;
      }
    }
  `]
})
export class PublisherSettingsComponent {
  activeTab: 'templates' | 'users' = 'templates';

  // Font Awesome icons
  faFileContract = faFileContract;
  faUsers = faUsers;
}